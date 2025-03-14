import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { globalStyles, PRIMARY_COLOR } from "../../utils/enums";
import {
  getOrderById,
  deleteOrder,
  getOrderByUser,
} from "../../services/orderService";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { payMethods } from "../../utils/data";
import ShowMessage from "../../funtions/Message";
import { AuthContext } from "../../common/context/AuthContext";

const OrderDetailsScreen = () => {
  // const orderId = "67c9da359b31486270d156fb";
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId, isNewOrder = false } = route.params;

  const [order, setOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const [selectPayment, setSelectPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const { setOrders, userId } = useContext(AuthContext);

  const fetchOrder = async (orderId) => {
    try {
      const response = await getOrderById(orderId);
      if (response && response.order && response.orderDetail) {
        setOrder(response.order);
        setOrderDetail(response.orderDetail);
        const choosePayment = payMethods.find(
          (item) => item.id == response.order.paymentId.paymentMethod
        );
        setSelectPayment(choosePayment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  // Kiểm tra xem đơn hàng có thể hủy không (chỉ hủy được khi đang ở trạng thái Pending hoặc Processing)
  const canCancel =
    order?.status === "Pending" ||
    order?.status === "Processing" ||
    order?.status === "Shipped";

  // Kiểm tra xem đơn hàng có thể đặt lại không (chỉ đặt lại khi đã hoàn thành hoặc đã hủy)
  const canReorder =
    order?.status === "Delivered" || order?.status === "Cancelled";

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            setLoading(true);
            // Gọi API hủy đơn hàng
            const response = await deleteOrder(orderId);
            console.log("response, delete", response);

            if (response) {
              // Hiển thị thông báo thành công
              ShowMessage("success", "Success", "Order cancelled successfully");

              // Đợi một chút để người dùng thấy thông báo
              setTimeout(async () => {
                const response = await getOrderByUser(userId);
                setOrders(response);
                setLoading(false);
              }, 500);
            } else {
              // Hiển thị thông báo lỗi nếu API trả về lỗi
              ShowMessage(
                "error",
                "Error",
                response?.message || "Failed to cancel order"
              );
              setLoading(false);
            }
          } catch (error) {
            console.log("Cancel order error:", error);
            ShowMessage(
              "error",
              "Error",
              "Failed to cancel order. Please try again."
            );
            setLoading(false);
          }
        },
      },
    ]);
  };

  // Xử lý đặt lại đơn hàng
  const handleReorder = () => {
    // Chuyển thông tin sản phẩm vào giỏ hàng
    if (orderDetail && orderDetail.length > 0) {
      // Thêm sản phẩm vào giỏ hàng và chuyển đến trang giỏ hàng
      // Đây là phần giả định, bạn cần thay thế bằng logic thực tế của ứng dụng
      Alert.alert("Reorder", "Do you want to add these items to your cart?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            // Thêm logic thêm vào giỏ hàng ở đây
            navigation.navigate("checklist");
          },
        },
      ]);
    }
  };

  // console.log("orderDetail", orderDetail);
  // console.log("order", order);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", paddingTop: -10 }}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        {/* <HeaderNav screen="Order Details" /> */}
        {order && (
          <View>
            {/* Address Section */}
            <View style={styles.addressContainer}>
              <Feather name="map-pin" size={20} color="black" />
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressText}>
                  {order?.shipAdressId?.address} {order?.shipAdressId?.city}{" "}
                  {order?.shipAdressId?.country}
                </Text>

                <Text style={styles.addressSubText}>
                  {order?.shipAdressId?.fullName} |{" "}
                  {order?.shipAdressId?.phoneNumber}
                </Text>
              </View>
              {/* <AntDesign name="right" size={20} color="black" /> */}
            </View>

            {/* Order Status */}
            <View style={styles.statusContainer}>
              <Text style={[styles.statusValue, { color: PRIMARY_COLOR }]}>
                {order?.paymentId?.status} payment
              </Text>
            </View>

            {/* Order Status */}
            {order?.status && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Order Status:</Text>
                <Text
                  style={[
                    styles.statusValue,
                    {
                      color:
                        order.status === "Delivered"
                          ? "#4CAF50"
                          : order.status === "Cancelled"
                          ? "#F44336"
                          : order.status === "Shipped"
                          ? "#2196F3"
                          : order.status === "Processing"
                          ? "#FF9800"
                          : "#9E9E9E",
                    },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            )}

            {/* Product List */}
            <ScrollView>
              {orderDetail &&
                orderDetail.map((item) => (
                  <View style={styles.productItem} key={item._id}>
                    <Image
                      style={styles.productImage}
                      source={
                        item?.productDetailId?.productId?.images
                          ? {
                              uri: item.productDetailId.productId.images[0],
                            }
                          : require("../../../assets/icon.png")
                      }
                    />

                    <View style={styles.productDetails}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <Text style={styles.productMeta}>
                        Quantity: {item?.quantity}, Size:{" "}
                        {item?.productDetailId?.size}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          marginVertical: 10,
                        }}
                      >
                        <Text>Color: </Text>
                        <View
                          style={[
                            styles.sizeContainer,
                            {
                              backgroundColor: item?.productDetailId?.color,
                            },
                          ]}
                        ></View>
                      </View>
                    </View>
                    <Text style={styles.productPrice}>Rs. {item.price}</Text>
                  </View>
                ))}
              <View style={[globalStyles.crossLine]}> </View>
            </ScrollView>

            {/* Price Details */}
            <View style={styles.priceDetails}>
              <Text style={styles.priceTitle}>Price Details</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Original Price</Text>
                <Text style={styles.priceValue}>
                  Rs. {(order?.totalAmount - 15000).toLocaleString("vi-Vn")}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Use Coupon</Text>
                <Text style={styles.discount}>
                  {orderDetail?.discountId == null
                    ? "--"
                    : orderDetail?.discountId?.discountValue}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Shipping Cost</Text>
                <Text style={styles.priceValue}>15.000</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Order ID</Text>
                <Text style={styles.priceValue}>{order._id}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Created Time</Text>
                <Text style={styles.priceValue}>{order.created_at}</Text>
              </View>
            </View>
            <View style={globalStyles.crossLine}></View>

            {/* Payment Method */}
            <Text style={styles.paymentText}>Pay Method</Text>
            <View>
              {selectPayment ? (
                <View key={selectPayment.id} style={styles.paymentOption}>
                  <FontAwesome5
                    name={selectPayment.icon}
                    size={20}
                    color="black"
                  />
                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={styles.paymentTitle}>
                      {selectPayment.name}
                    </Text>
                    <Text style={styles.paymentDescription}>
                      {selectPayment.description}
                    </Text>
                  </View>
                  <RadioButton
                    value={selectPayment.id}
                    status={
                      order.paymentId.paymentMethod === selectPayment.id
                        ? "checked"
                        : "unchecked"
                    }
                  />
                </View>
              ) : (
                <Text>Payment method not found</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Total and Action Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>
            {order?.totalAmount.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>

        {/* Hiển thị các nút hành động chỉ khi không phải đơn hàng mới */}
        {!isNewOrder && order && (
          <View style={styles.actionButtonsContainer}>
            {canCancel && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.cancelButton,
                  loading && styles.disabledButton,
                ]}
                onPress={handleCancelOrder}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.cancelButtonText}>Processing...</Text>
                ) : (
                  <Text style={styles.cancelButtonText}>Cancel Order</Text>
                )}
              </TouchableOpacity>
            )}

            {canReorder && (
              <TouchableOpacity
                style={[styles.actionButton, styles.reorderButton]}
                onPress={handleReorder}
                disabled={loading}
              >
                <Text style={styles.reorderButtonText}>Re-order</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  addressSubText: {
    fontSize: 12,
    color: "gray",
    marginVertical: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    marginRight: 5,
  },
  statusValue: {
    fontSize: 14,
    // fontWeight: "bold",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  productImage: {
    width: 79,
    height: 85,
    borderRadius: 15,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  productMeta: {
    fontSize: 12,
    color: "gray",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  priceDetails: {
    paddingVertical: 12,
  },
  priceTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  priceLabel: {
    fontSize: 12,
    color: "gray",
  },
  priceValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
    opacity: 0.4,
  },
  discount: {
    fontSize: 12,
    fontWeight: "500",
    color: PRIMARY_COLOR,
  },
  copyText: {
    color: "blue",
  },
  paymentContainer: {
    paddingVertical: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paymentOptions: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentOptionText: {
    marginRight: 16,
    fontSize: 14,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 40,
  },
  totalAmount: {
    fontSize: 30,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginLeft: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 150,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#F44336",
  },
  cancelButtonText: {
    color: "#F44336",
    fontWeight: "bold",
  },
  reorderButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  reorderButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  paymethod: {
    width: 167,
    height: 42,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  paymethodSelected: {
    borderColor: PRIMARY_COLOR,
  },
  sizeContainer: {
    width: 31,
    height: 30,
    borderRadius: 16,
    backgroundColor: "#24232B",
    position: "relative",
  },

  // Payment Options
  // payment method
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentDescription: {
    fontSize: 14,
    color: "gray",
  },
  paymentText: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 30,
    marginBottom: 5,
  },
});

export default OrderDetailsScreen;
