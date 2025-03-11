import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { PRIMARY_COLOR } from "../../utils/enums";
import HeaderNav from "../common/HeaderNav";
import ButtonText from "../common/ButtonText";
import { AuthContext } from "../../common/context/AuthContext";
import { getAddressByUser } from "../../services/shippingAddressService";
import { useRoute } from "@react-navigation/native";
import ShowMessage from "../../funtions/Message";
import { createOrder } from "../../services/orderService";
import { deleteCard } from "../../services/cardService";
import AddAddressModal from "../common/ModalAddress";
import { Modal } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import ListAddressModal from "../common/ListAddressModal";
import { payMethods } from "../../utils/data";

const PayOrder = ({ navigation }) => {
  const [address, setAddress] = useState([]);
  const { userId } = useContext(AuthContext);
  const route = useRoute();
  const { totalAmount, selectedProduct, isSelected } = route.params;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isVisible, setModalVisible] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);
  const [chooseAddress, setChooseAddress] = useState("");

  const today = new Date(); // Lấy ngày hiện tại
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const fetchAddress = async () => {
    try {
      if (userId) {
        const responseAddress = await getAddressByUser(userId);
        if (responseAddress) {
          setAddress(responseAddress);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchAddress();
    }
  }, [userId]);

  const deleteC = async (cardId) => {
    try {
      await deleteCard(cardId);
      console.log("delete card");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      if (!selectedAddress || !paymentMethod) {
        ShowMessage(
          "error",
          "Warning",
          "Please choose payment method and address"
        );
        return;
      }
      const orderData = {
        userId,
        totalAmount,
        paymentMethod,
        shippingAddress: selectedAddress,
        orderItems: selectedProduct,
      };
      const response = await createOrder(orderData);
      console.log("repsonse", response);
      if (response) {
        if (isSelected.length > 0) {
          await Promise.all(isSelected.map((item) => deleteC(item)));
        }
        if (response && response.data.data) {
          const newOrderId = response.data.data.order._id;
          navigation.navigate("complete", { orderId: newOrderId });
        }
      } else {
        ShowMessage("error", "Error", "Fail to order");
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  const handleAddNewAddress = () => {
    setModalVisible(true);
  };

  const handleChooseAddress = (item) => {
    setSelectedAddress(item._id);
    setModalAddress(false);
  };

  // const handleChoosePaymentMethod = (item) => {
  //   if (!chooseAddress) {
  //     ShowMessage(
  //       "error",
  //       "Warinng",
  //       "Please choose address before select payment method!!!"
  //     );
  //   } else {
  //     setPaymentMethod(item.id);
  //   }
  // };

  const handleChoosePaymentMethod = (item) => {
    if (!chooseAddress) {
      ShowMessage(
        "error",
        "Warning",
        "Please choose address before selecting a payment method!!!"
      );
      return;
    }

    setPaymentMethod(item.id);

    // Điều hướng theo từng phương thức thanh toán
    switch (item.id) {
      case "vnpay_qr":
        navigation.navigate("VNPayQR", { amount: totalAmount });
        break;
      case "vnpay_online":
        navigation.navigate("VNPayOnline", { amount: totalAmount });
        break;
      case "vnpay_bank":
        navigation.navigate("VNPayBank", { amount: totalAmount });
        break;
      case "cash":
        handleCompleteOrder();
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.container}>
        {/* Address */}
        <View
          style={{
            marginTop: 30,
            borderBottomColor: "#e8e8e8",
            borderBottomWidth: 1,
            height: 180,
          }}
        >
          <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
            <Text style={styles.deliverAddressText}> Delivery Address</Text>
            <TouchableOpacity
              style={styles.selectAddressButton}
              onPress={() => setModalAddress(true)}
            >
              <Text style={{ color: PRIMARY_COLOR, fontSize: 16 }}>
                Chọn địa chỉ
              </Text>
            </TouchableOpacity>
          </View>
          {chooseAddress ? (
            <View style={styles.selectedAddressBox}>
              <Text>{chooseAddress.fullName}</Text>
              <Text>
                {chooseAddress.address}, {chooseAddress.city},{" "}
                {chooseAddress.country}
              </Text>
              <Text>{chooseAddress.phoneNumber}</Text>
            </View>
          ) : (
            <Text style={{ fontSize: 16, color: "gray", marginVertical: 10 }}>
              Chưa chọn địa chỉ
            </Text>
          )}

          {/* Add a new Address */}
          <TouchableOpacity
            style={styles.addAddressText}
            onPress={() => handleAddNewAddress()}
          >
            <Text style={{ color: PRIMARY_COLOR, fontSize: 16 }}>
              + Add a new Address
            </Text>
          </TouchableOpacity>
        </View>

        {/* Line */}
        {/* <View style={styles.crossLine}></View> */}

        <View>
          <Text style={styles.paymentText}>Payment method</Text>

          {/* Payment Method */}
          <View>
            {payMethods.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.paymentOption}
                onPress={() => handleChoosePaymentMethod(item)}
                // onPress={() => setPaymentMethod(item.id)}
              >
                <FontAwesome5 name={item.icon} size={20} color="black" />
                <View
                  style={{ flex: 1, paddingVertical: 5, paddingHorizontal: 10 }}
                >
                  <Text style={styles.paymentTitle}>{item.name}</Text>
                  <Text style={styles.paymentDescription}>
                    {item.description}
                  </Text>
                </View>
                <RadioButton
                  value={item.id}
                  status={paymentMethod === item.id ? "checked" : "unchecked"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Delivery */}
          <View style={[styles.flexBox, { marginTop: 20 }]}>
            <FontAwesome6 name="truck-fast" size={24} color={PRIMARY_COLOR} />
            <Text>
              Estimated delivery:{" "}
              <Text style={{ fontWeight: "bold" }}>{formattedDate}</Text>
            </Text>
          </View>

          {/* Total */}
          <View style={styles.flexBox}>
            <Text>Amount Payable</Text>
            <Text style={styles.totalAmount}>
              {totalAmount.toLocaleString("vi-Vn")} VNĐ
            </Text>
          </View>

          {isVisible && (
            <AddAddressModal
              isVisible={isVisible}
              setModalVisible={setModalVisible}
              onAddNewAddress={fetchAddress}
            />
          )}

          {/* Modal chọn địa chỉ */}
          {modalAddress && (
            <ListAddressModal
              address={address}
              modalAddress={modalAddress}
              setModalAddress={setModalAddress}
              chooseAddress={chooseAddress}
              setChooseAddress={setChooseAddress}
              handleChooseAddress={handleChooseAddress}
            />
          )}

          {/* Button */}
          {/* <TouchableOpacity onPress={() => handleChoosePaymentMethod()}>
            <ButtonText text="Pay and Complete Order" />
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PayOrder;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    position: "relative",
    backgroundColor: "white",
  },
  addressBox: {
    width: 300,
    height: 118,
    flexDirection: "row",
    gap: 10,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#E8E8E8",
    marginBottom: 20,
  },
  selectedAddress: {
    backgroundColor: "#ccc",
  },
  selectedText: {
    color: "white",
  },
  paymentText: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 30,
    marginBottom: 5,
  },
  crossLine: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    width: 321,
    alignSelf: "center",
    marginVertical: 30,
  },
  deliverAddressText: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  addAddressText: {
    width: 150,
    height: 20,
    borderBottomColor: PRIMARY_COLOR,
    borderBottomWidth: 0.5,
    marginVertical: 10,
  },
  flexBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  deliverAddressText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  selectAddressButton: {
    // backgroundColor: PRIMARY_COLOR,
    padding: 7,
    borderRadius: 10,
    alignItems: "center",
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
    width: 150,
    height: 40,
  },
  selectedAddressBox: {
    backgroundColor: "#E8E8E8",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

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

  totalAmount: {
    fontWeight: "bold",
    fontSize: 30,
    color: PRIMARY_COLOR,
    fontFamily: "quicksand",
  },
});
