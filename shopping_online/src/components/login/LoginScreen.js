import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonText from "../common/ButtonText";
import ButtonTextWhite from "../common/ButtonTextWhite";

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../../assets/loginScreen.png")}
        style={styles.image}
      />

      <View style={styles.textBox}>
        <Text style={styles.welcome}>Welcome back, please login!</Text>
        <Text style={styles.enter}>
          Enter your acccount information to access our store
        </Text>
      </View>

      <ButtonText text="Login" />
      <ButtonTextWhite text="Sign up" />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  image: {
    alignSelf: "center",
    marginTop: 150,
  },
  textBox: {
    textAlign: "center",
    marginVertical: 70,
  },
  welcome: {
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
  },
  enter: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});
