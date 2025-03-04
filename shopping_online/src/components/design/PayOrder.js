import React, { useMemo, useState } from "react";
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

const PayOrder = () => {
  const payMethods = [
    { id: "cash", name: "Cash" },
    { id: "VnPay", name: "VnPay" },
  ];

  const addresses = [
    {
      id: "selina",
      name: "Selina K",
      address: "21/3, Ragava Street, Silver tone, Kodaikanal - 655 789",
    },
    { id: "raghu", name: "Raghu", address: "44, Arc Down Town, Kodaikanal" },
  ];
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedAddress, setSelectedAddress] = useState("selina");

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <HeaderNav screen="Checkout" />
        <Text style={styles.paymentText}>Payment method</Text>

        <View style={{ gap: 5 }}>
          {payMethods.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <RadioButton
                value={item.id}
                status={paymentMethod === item.id ? "checked" : "Unchecked"}
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
              {addresses.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.addressBox,
                    selectedAddress == item.id && styles.selectedAddress,
                  ]}
                >
                  <RadioButton
                    value={item.id}
                    status={
                      selectedAddress === item.id ? "checked" : "Unchecked"
                    }
                  />
                  <View style={{ width: 158 }}>
                    <Text
                      style={selectedAddress == item.id && styles.selectedText}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={selectedAddress == item.id && styles.selectedText}
                    >
                      {item.address}
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
              <Text style={{ fontWeight: "bold" }}>25 March 2024</Text>
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
              75.000 VNĐ
            </Text>
          </View>

          {/* Button */}
          <ButtonText text="Pay and Complete Order" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PayOrder;

const styles = StyleSheet.create({
  container: { margin: 20, position: "relative" },
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
    backgroundColor: "#000000",
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
