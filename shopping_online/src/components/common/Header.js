import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import TopLeft from "./TopLeft";

const Header = () => {
  return (
    <View style={styles.container}>
      <TopLeft />
      <View style={styles.topRight}>
        <Ionicons name="notifications-outline" size={24} color="black" />
        <AntDesign name="hearto" size={24} color="black" />
        <View>
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
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
    height: 54,
  },

  topRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
