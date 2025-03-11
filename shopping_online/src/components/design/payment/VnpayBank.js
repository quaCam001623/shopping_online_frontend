import React from "react";
import { View, Text, WebView, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { PRIMARY_COLOR } from "../../../utils/enums";

const VNPayBank = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { amount } = route.params;

  const paymentUrl = `https://sandbox.vnpayment.vn/payment?method=VNBANK&amount=${amount}`;

  return (
    <View style={{ flex: 1 }}>
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
      <WebView source={{ uri: paymentUrl }} style={{ flex: 1 }} />
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
    </View>
  );
};

export default VNPayBank;
