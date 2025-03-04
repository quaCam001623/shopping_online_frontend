import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { PRIMARY_COLOR } from "../../utils/enums";

const ButtonTextWhite = ({ text }) => {
  return (
    <View style={styles.button}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default ButtonTextWhite;

const styles = StyleSheet.create({
  container: {},
  button: {
    width: 354,
    height: 52,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: "auto",
    marginVertical: 10,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  text: {
    color: PRIMARY_COLOR,
    textAlign: "center",
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 15,
  },
});
