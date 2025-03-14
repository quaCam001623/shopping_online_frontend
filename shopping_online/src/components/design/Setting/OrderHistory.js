import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../common/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PRIMARY_COLOR } from "../../../utils/enums";
import Feather from "@expo/vector-icons/Feather";
import { AuthContext } from "../../../common/context/AuthContext";
import { getOrderByUser } from "../../../services/orderService";

const OrderHistory = ({ navigation }) => {
  const { userId, orders } = useContext(AuthContext);
  // const [orderByUser, setOrderByUser] = useState();

  // const fetchOrder = async () => {
  //   try {
  //     const response = await getOrderByUser(userId);
  //     if (response) {
  //       setOrderByUser(response);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (userId) {
  //     fetchOrder();
  //   }
  // }, [userId]);

  // Function to get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <Feather
            name="check"
            size={12}
            color="white"
            style={[styles.statusIcon, { backgroundColor: "#4CAF50" }]}
          />
        );
      case "Shipped":
        return (
          <Feather
            name="truck"
            size={12}
            color="white"
            style={[styles.statusIcon, { backgroundColor: "#2196F3" }]}
          />
        );
      case "Processing":
        return (
          <Feather
            name="clock"
            size={12}
            color="white"
            style={[styles.statusIcon, { backgroundColor: "#FF9800" }]}
          />
        );
      case "Cancelled":
        return (
          <Feather
            name="x"
            size={12}
            color="white"
            style={[styles.statusIcon, { backgroundColor: "#F44336" }]}
          />
        );
      default:
        return (
          <Feather
            name="loader"
            size={12}
            color="white"
            style={[styles.statusIcon, { backgroundColor: "#9E9E9E" }]}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />

      {/* Order History */}
      <View style={styles.box}>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 20 }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign
            name="left"
            size={18}
            color="#777290"
            style={{ marginRight: 10 }}
          />

          <Text style={styles.textLeft}>Order History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {orders && orders.length > 0 ? (
          orders.map((firstProduct) => {
            const order = firstProduct[0];

            // Get order status
            const orderStatus = order?.orderId?.status || "Pending";

            return (
              <View style={styles.card} key={order._id}>
                <Image
                  style={styles.image}
                  source={
                    order?.productDetailId?.productId?.images?.length > 0
                      ? { uri: order.productDetailId.productId.images[0] }
                      : require("../../../../assets/icon.png")
                  }
                />
                <View style={styles.orderInfo}>
                  <Text style={styles.orderIdText}>
                    Order #{order._id.slice(0, 8)}...
                  </Text>
                  {/* <Text>
                    Product:{" "}
                    {order?.productDetailId?.productId?.name ||
                      "Unknown Product"}
                  </Text> */}
                  <View style={styles.delivered}>
                    <Text
                      style={[
                        styles.deliveredText,
                        orderStatus === "Cancelled" && { color: "#F44336" },
                        orderStatus === "Processing" && { color: "#FF9800" },
                        orderStatus === "Shipped" && { color: "#2196F3" },
                        orderStatus === "Delivered" && { color: "#4CAF50" },
                        orderStatus === "Pending" && { color: "#9E9E9E" },
                      ]}
                    >
                      {orderStatus}
                    </Text>
                    {getStatusIcon(orderStatus)}
                  </View>
                  <View style={styles.itemsBox}>
                    <Text> {firstProduct?.length || 1} items</Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        // You can navigate to order details screen here
                        navigation.navigate("orderdetail", {
                          orderId: order.orderId._id,
                        });
                      }}
                    >
                      <Text style={styles.buttonText}>Review</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text>No orders found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 15,
  },
  box: {
    width: 350,
    height: 45,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#777e90",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 5,
    marginTop: 9,
    marginBottom: 20,
  },
  iconLeft: {
    width: 24,
    height: 24,
    textAlign: "center",
    backgroundColor: "#ebf1ff",
    borderRadius: 12,
    paddingTop: 3,
  },
  textLeft: { fontSize: 16, fontWeight: "400" },

  //CARD
  card: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
    width: 350,
    minHeight: 100,
    padding: 15,
    alignSelf: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 78,
    height: 85,
    borderRadius: 15,
    objectFit: "cover",
  },
  orderInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: "500",
  },
  delivered: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 4,
  },
  deliveredText: { fontSize: 17, fontWeight: "bold" },
  statusIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    paddingTop: 1,
    paddingLeft: 2,
  },
  deliveredIcon: {
    backgroundColor: PRIMARY_COLOR,
    width: 16,
    height: 16,
    borderRadius: 8,
    paddingTop: 1,
    paddingLeft: 2,
  },
  itemsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  button: {
    width: 86,
    height: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 50,
  },
});
