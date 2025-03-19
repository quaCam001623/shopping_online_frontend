import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { PRIMARY_COLOR } from "../../../utils/enums";
import { WebView } from "react-native-webview";
import { createURLPayment } from "../../../services/vnpayService";
import ShowMessage from "../../../funtions/Message";
import { SafeAreaView } from "react-native-safe-area-context";

const VNPayQR = () => {
  const route = useRoute();

  const navigation = useNavigation();
  const { amount } = route.params;
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = {
          orderId: "BK-" + Math.floor(100000 + Math.random() * 900000),
          totalPrice: amount,
          orderInfo: ``,
          orderType: `Thanh toán online`,
          bankCode: "VNPAYQR",
        };

        data.orderInfo = `Thanh toán ${amount} VNĐ với mã đơn hàng ${data.orderId}`;

        const paymentUrl = await createURLPayment(data);
        console.log("paymentUrl, ", paymentUrl.data);
        if (paymentUrl.status === 200) {
          setUrl(paymentUrl.data.url);
        } else {
          console.log("Fail to create QR");
          ShowMessage("error", "Error", "Fail to create QR");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrder();
  }, [amount]);

  //   const paymentUrl = `https://sandbox.vnpayment.vn/payment?method=VNPAYQR&amount=${amount}`;

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
        Thanh toán bằng VietQR
      </Text>
      <WebView source={{ uri: url }} style={{ flex: 1 }} />
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

export default VNPayQR;
