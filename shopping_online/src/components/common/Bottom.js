import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

const Bottom = () => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Feather
          style={{ color: "#ecabc1" }}
          name="home"
          size={24}
          color="black"
        />
        <Text style={{ color: "#ecabc1" }}>Home</Text>
        <View
          style={{
            width: 63,
            height: 4,
            backgroundColor: "#ecabc1",
            borderRadius: 10,
            marginTop: 15,
          }}
        ></View>
      </View>
      <View style={styles.item}>
        <Feather name="search" size={24} color="black" />
        <Text>Search</Text>
      </View>
      <View style={styles.item}>
        <AntDesign name="user" size={24} color="black" />
        <Text>Profile</Text>
      </View>
    </View>
  );
};

export default Bottom;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 59,
    alignItems: "center",
    justifyContent: "space-around",
    margin: 10,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
});
