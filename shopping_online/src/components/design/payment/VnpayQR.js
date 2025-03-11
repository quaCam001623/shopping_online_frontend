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
          bankCode: "VNPAYQR",
          amount,
        };
        const paymentUrl = await createURLPayment(data);
        if (!paymentUrl) {
          console.log("Fail to create QR");
          ShowMessage("error", "Error", "Fail to create QR");
          return;
        }
        setUrl(paymentUrl);
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
