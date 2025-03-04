import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const TopLeft = () => {
  return (
    <View style={styles.topLeft}>
      <Image
        style={styles.image}
        source={require("../../../assets/icon.png")}
      />
      <Text style={{ fontSize: 24, fontWeight: 600 }}>Bloom</Text>
    </View>
  );
};

export default TopLeft;

const styles = StyleSheet.create({
  image: {
    width: 52,
    height: 52,
    borderRadius: 30,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    // marginLeft: 10,
    gap: 10,
  },
});
