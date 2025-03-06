import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

const Bottom = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item}>
        <Feather name="home" size={24} color="gray" />
        <Text style={styles.title}>Home</Text>
        {/* <View
          style={{
            width: 63,
            height: 4,
            backgroundColor: "#ecabc1",
            borderRadius: 10,
            marginTop: 15,
          }}
        ></View> */}
      </TouchableOpacity>
      <View style={styles.item}>
        <Feather name="search" size={24} color="gray" />
        <Text style={styles.title}>Search</Text>
      </View>
      <View style={styles.item}>
        <AntDesign name="user" size={24} color="gray" />
        <Text style={styles.title}>Profile</Text>
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
  title: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 16,
  },
});
