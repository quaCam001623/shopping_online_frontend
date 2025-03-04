import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Octicons from "@expo/vector-icons/Octicons";
import Header from "../../common/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { PRIMARY_COLOR } from "../../../utils/enums";
import Feather from "@expo/vector-icons/Feather";

const OrderHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <Text style={styles.title}>Order History</Text>
      {/* Order History */}
      <View style={styles.box}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Octicons
            name="history"
            size={18}
            color="#777290"
            style={styles.iconLeft}
          />
          <Text style={styles.textLeft}>Order History</Text>
        </View>
        <TouchableOpacity>
          <AntDesign name="right" size={18} color="#777290" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Image
          source={require("../../../../assets/shirt1.png")}
          style={styles.image}
        />
        <View>
          <Text>Order #922287157</Text>
          <View style={styles.delivered}>
            <Text style={styles.deliveredText}>Delivered</Text>
            <Feather
              name="check"
              size={12}
              color="white"
              style={styles.deliveredIcon}
            />
          </View>
          <View style={styles.itemsBox}>
            <Text> 3 items</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
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
    justifyContent: "center",
    gap: 30,
    width: 310,
    height: 86,
    padding: 10,
    alignSelf: "center",
  },
  image: {
    width: 78,
    height: 85,
    borderRadius: 15,
    objectFit: "cover",
  },
  delivered: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 4,
  },
  deliveredText: { fontSize: 17, fontWeight: "bold" },
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
  },
  button: {
    width: 86,
    height: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    marginLeft: 60,
  },
  buttonText: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    textAlign: "center",
    paddingTop: 1,
  },
});
