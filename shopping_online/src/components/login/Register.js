import React, { useState } from "react";
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
import { createUsers } from "../../services/userService";

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleRegister = async () => {
    const user = { firstName, lastName, email, phoneNumber: phone, password };
    console.log("register user", user);
    const response = await createUsers(user);
    if (response) navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
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
        <Text style={{ fontSize: 16, paddingTop: 5 }}>Sign up</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Get’s started.</Text>
        <Text style={styles.subtitle}>
          Don’t have an account? <Text style={styles.signInText}>Sign in</Text>
        </Text>

        {/* Form nhập liệu */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />

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
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 15 }]}>Phone number</Text>
        <View style={styles.phoneContainer}>
          {/* <Text style={styles.countryCode}>+84</Text> */}
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Remember me + Forgot password */}
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

        {/* Nút đăng ký */}
        <Button
          mode="contained"
          style={styles.signUpButton}
          onPress={() => handleRegister()}
        >
          Sign up
        </Button>
      </View>
    </View>
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
  signInText: {
    color: PRIMARY_COLOR,
    fontWeight: "500",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    // paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    paddingLeft: 8,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 8,
  },
  countryCode: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  phoneInput: {
    flex: 1,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 20,
  },
  rememberText: {
    flex: 1,
  },
  forgotPassword: {
    color: PRIMARY_COLOR,
    fontWeight: "500",
  },
  signUpButton: {
    width: "100%",
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default Register;
