import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Checkbox, IconButton, Button } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PRIMARY_COLOR } from "../../utils/enums";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../common/context/AuthContext";

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  const [secureText, setSecureText] = useState(true);
  console.log(`email:${email} - password:${password}`);
  const handleLogin = () => {
    const result = login(email, password);
    if (result) navigation.navigate("Main");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* button back */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.buttonBack}
      >
        <AntDesign
          name="left"
          size={20}
          color="white"
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: PRIMARY_COLOR,
            marginTop: 10,
            paddingTop: 5,
            paddingLeft: 5,
          }}
        />
        <Text style={{ fontSize: 16, paddingTop: 5 }}>Login</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Get’s started.</Text>
        <Text style={styles.subtitle}>
          Don’t have an account?
          <TouchableOpacity onPress={() => navigation.navigate("register")}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <IconButton
              icon={secureText ? "eye-off" : "eye"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rememberContainer}>
          {/* <Checkbox
            status={rememberMe ? "checked" : "unchecked"}
            onPress={() => setRememberMe(!rememberMe)}
          />
          <Text style={styles.rememberText}>Remember me</Text> */}
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          style={styles.signInButton}
          onPress={() => handleLogin()}
        >
          Sign in
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBack: {
    position: "absolute",
    top: 40,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginLeft: 20,
  },
  card: {
    backgroundColor: "white",
    width: "85%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 15,
  },
  subtitle: {
    color: "gray",
    marginBottom: 25,
  },
  signUpText: {
    color: PRIMARY_COLOR,
    fontWeight: "500",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 9,
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingRight: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  rememberText: {
    flex: 1,
  },
  forgotPassword: {
    color: PRIMARY_COLOR,
    fontWeight: "500",
  },
  signInButton: {
    width: "100%",
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default Login;
