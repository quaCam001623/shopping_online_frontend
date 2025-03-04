import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";

const HeaderNav = ({ screen }) => {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        {/* Nút quay lại */}
        <TouchableOpacity
          // onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        {/* Tiêu đề */}
        <Text style={styles.title}>{screen}</Text>

        {/* Giỏ hàng */}
        <TouchableOpacity
        // onPress={() => navigation.navigate("Cart")}
        // style={styles.cartButton}
        >
          <View s>
            <Feather
              name="shopping-bag"
              size={24}
              color="black"
              style={{ position: "relative" }}
            />
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 50,
                backgroundColor: "#FF937B",
                position: "absolute",
                bottom: 10,
                left: 10,
                margin: 2,
              }}
            ></View>
            <Text
              style={{
                position: "absolute",
                bottom: 13,
                left: 18,
                color: "white",
              }}
            >
              2
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",

    marginRight: 10,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});

export default HeaderNav;
