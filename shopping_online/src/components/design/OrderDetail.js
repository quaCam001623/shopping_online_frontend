import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Checkbox, RadioButton } from "react-native-paper";
import HeaderNav from "../common/HeaderNav";
import { globalStyles, PRIMARY_COLOR } from "../../utils/enums";
import { product } from "../../utils/data";
import Bottom from "../common/Bottom";

const OrderDetailsScreen = () => {
  const payMethods = [
    { id: "cash", name: "Cash" },
    { id: "vnpay", name: "VnPay" },
  ];
  const [selectPayment, setSelectPayment] = useState("vnpay");

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderNav screen="Order Details" />

      <ScrollView>
        {/* Address Section */}
        <View style={styles.addressContainer}>
          <Feather name="map-pin" size={20} color="black" />
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressText}>
              456 Creative Lane San Francisco, CA 94102, United States
            </Text>
            <Text style={styles.addressSubText}>
              Sanzu Sa | +1 675 555 1234
            </Text>
          </View>
          <AntDesign name="right" size={20} color="black" />
        </View>

        {/* Order Status */}
        <Text style={{ color: PRIMARY_COLOR, marginLeft: 270 }}>
          Pending Payment
        </Text>

        {/* Product List */}
        <View>
          {product.slice(0, 2).map((item) => (
            <View style={styles.productItem} key={item.id}>
              <Image source={item.img} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productMeta}>Quantity: 1, Size: S</Text>
              </View>
              <Text style={styles.productPrice}>Rs. {item.price}</Text>
            </View>
          ))}
          <View style={[globalStyles.crossLine]}> </View>
        </View>

        {/* Price Details */}
        <View style={styles.priceDetails}>
          <Text style={styles.priceTitle}>Price Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Original Price</Text>
            <Text style={styles.priceValue}>Rs. 1000</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Use Coupon</Text>
            <Text style={styles.discount}>- $0.20</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Cost</Text>
            <Text style={styles.priceValue}>$0.04</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Order ID</Text>
            <Text style={styles.priceValue}>
              35325565555788 <Text style={styles.copyText}>| Copy</Text>
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Created Time</Text>
            <Text style={styles.priceValue}>2024-03-04 11:40:52</Text>
          </View>
        </View>
        <View style={globalStyles.crossLine}></View>

        {/* Payment Method */}
        <Text style={{ marginVertical: 20, fontWeight: "bold" }}>
          Pay Method
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[styles.paymethod, styles.selectPayment]}>
            <Feather name="dollar-sign" size={24} color="black" />
            <Text>Cash</Text>
            <RadioButton styles={{ marginLeft: 20 }} />
          </View>
          <View style={styles.paymethod}>
            <Feather name="smartphone" size={24} color="black" />
            <Text>VnPay</Text>
            <RadioButton
              styles={{ marginLeft: 20, backgroundColor: PRIMARY_COLOR }}
            />
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>$90.00</Text>
        </View>
      </ScrollView>

      {/* Bottom */}
      <Bottom />
    </View>
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
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 20,
    marginVertical: 20,
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
});

export default OrderDetailsScreen;
