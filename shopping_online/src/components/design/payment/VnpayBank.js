import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { PRIMARY_COLOR } from "../../../utils/enums";
import { WebView } from "react-native-webview";
import { createURLPayment } from "../../../services/vnpayService";
import ShowMessage from "../../../funtions/Message";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteCard } from "../../../services/cardService";
import { createOrder } from "../../../services/orderService";

const VNPayBank = ({ navigation }) => {
  const route = useRoute();
  const { amount, orderData, isSelected } = route.params;
  const [url, setUrl] = useState("");

  console.log("orderData", orderData);
  console.log("isSelected", isSelected);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = {
          orderId: "BK-" + Math.floor(100000 + Math.random() * 900000),
          totalPrice: amount,
          orderInfo: ``,
          orderType: `Thanh toán online`,
          bankCode: "NCB",
        };

        data.orderInfo = `Thanh toán ${amount} VNĐ với mã đơn hàng ${data.orderId}`;

        const paymentUrl = await createURLPayment(data);

        if (paymentUrl && paymentUrl.data) {
          setUrl(paymentUrl.data.url);
        } else {
          console.log("Invalid payment URL response:", paymentUrl);
          ShowMessage("error", "Error", "Không thể tạo URL thanh toán");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrder();
  }, [amount]);

  const handleCompleteOrder = async () => {
    try {
      const response = await createOrder(orderData);
      console.log("repsonse", response);
      if (response) {
        if (isSelected.length > 0) {
          await Promise.all(isSelected.map((item) => deleteCard(item)));
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

  const handlePaymentSuccess = ({ url }) => {
    // Xử lý kết quả thanh toán từ URL
    const params = new URLSearchParams(url.split("?")[1]);
    const vnp_ResponseCode = params.get("vnp_ResponseCode");
    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      // Chuyển hướng đến màn hình thành công
      handleCompleteOrder();
    } else {
      // Thanh toán thất bại
      // Chuyển hướng đến màn hình thất bại
      // ShowMessage("error", "Error", "Payment fail!!!");
      // navigation.navigate("PaymentFailed");
    }
  };
  // const paymentUrl = `https://sandbox.vnpayment.vn/payment?method=VNBANK&amount=${amount}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Thanh toán bằng thẻ ngân hàng nội địa
      </Text>
      <WebView
        source={{ uri: url }}
        onNavigationStateChange={(event) => handlePaymentSuccess(event)}
        style={{ flex: 1 }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: PRIMARY_COLOR,
          padding: 15,
          margin: 20,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Quay lại</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VNPayBank;
