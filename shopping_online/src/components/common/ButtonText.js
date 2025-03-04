import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { PRIMARY_COLOR } from "../../utils/enums";

const ButtonText = ({ text }) => {
  return (
    <View style={styles.button}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default ButtonText;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
  },
  button: {
    width: 354,
    height: 52,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    marginHorizontal: "auto",
    marginVertical: 10,
  },
  text: {
    color: "white",
    textAlign: "center",
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 15,
  },
});
