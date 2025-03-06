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

const PayOrder = ({ navigation }) => {
  const [address, setAddress] = useState([]);
  const { userId } = useContext(AuthContext);
  const route = useRoute();
  const { totalAmount, selectedProduct, isSelected } = route.params;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const today = new Date(); // Lấy ngày hiện tại
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetch = async (userId) => {
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
    fetch(userId);
  }, [userId]);

  // console.log("address", address);

  const payMethods = [
    { id: "cash", name: "Cash" },
    { id: "VnPay", name: "VnPay" },
  ];

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
      if (response.status == 200) {
        if (isSelected.length > 0) {
          await Promise.all(isSelected.map((item) => deleteC(item)));
        }
        navigation.navigate("complete");
      } else {
        ShowMessage("error", "Error", "Fail to order");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <HeaderNav screen="Checkout" navigation={navigation} />
        <Text style={styles.paymentText}>Payment method</Text>

        <View style={{ gap: 5 }}>
          {payMethods.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
              onPress={() => setPaymentMethod(item.id)}
            >
              <RadioButton
                value={item.id}
                status={paymentMethod == item.id ? "checked" : "unchecked"}
              />
              <Text style={{ fontSize: 17 }}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.crossLine}></View>

        <Text style={styles.deliverAddressText}> Delivery Address</Text>
        <View>
          <View style={{ height: 300 }}>
            <ScrollView>
              {address &&
                address.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={[
                      styles.addressBox,
                      selectedAddress === item._id && styles.selectedAddress,
                    ]}
                    onPress={() => setSelectedAddress(item._id)} // Thêm sự kiện cập nhật state
                  >
                    <RadioButton
                      value={item._id}
                      status={
                        selectedAddress == item._id ? "checked" : "unchecked"
                      }
                      onPress={() => setSelectedAddress(item._id)} // Đảm bảo RadioButton cũng có sự kiện onPress
                    />
                    <View style={{ width: 158 }}>
                      <Text
                        style={
                          selectedAddress === item._id && styles.selectedText
                        }
                      >
                        {item.fullName}
                      </Text>
                      <Text
                        style={
                          selectedAddress === item._id && styles.selectedText
                        }
                      >
                        {item.address}, {item.city}, {item.country}
                      </Text>
                      <Text
                        style={
                          selectedAddress === item._id && styles.selectedText
                        }
                      >
                        {item.phoneNumber}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>

          {/* Add a new Address */}
          <View style={styles.addAddressText}>
            <Text style={{ color: PRIMARY_COLOR, fontSize: 16 }}>
              + Add a new Address
            </Text>
          </View>

          {/* Delivery */}
          <View style={styles.flexBox}>
            <FontAwesome6 name="truck-fast" size={24} color={PRIMARY_COLOR} />
            <Text>
              Estimated delivery:{" "}
              <Text style={{ fontWeight: "bold" }}>{formattedDate}</Text>
            </Text>
          </View>

          {/* Total */}
          <View style={styles.flexBox}>
            <Text>Amount Payable</Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 30,
                color: PRIMARY_COLOR,
                fontFamily: "quicksand",
              }}
            >
              {totalAmount.toLocaleString("vi-Vn")} VNĐ
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity onPress={() => handleCompleteOrder()}>
            <ButtonText text="Pay and Complete Order" />
          </TouchableOpacity>
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
    marginBottom: 15,
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
    marginBottom: 20,
  },
  flexBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
});
