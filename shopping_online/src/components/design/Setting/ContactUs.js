import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../common/Header";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import Footer from "../../common/Footer";
import { PRIMARY_COLOR } from "../../../utils/enums";
import { AuthContext } from "../../../common/context/AuthContext";
import { createMessage } from "../../../services/messageServive";

const ContactUs = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    message: "",
    email: "",
  });

  // const [loginForm, setLoginForm] = useState({
  //   email: "",
  //   password: "",
  // });

  // const [showLoginModal, setShowLoginModal] = useState(false);
  // const [loginError, setLoginError] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        if (user) {
          setIsLoggedIn(true);
          // Pre-fill form with user data
          setForm((prevForm) => ({
            ...prevForm,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
          }));
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle send message
  const handleSendMessage = async () => {
    try {
      setLoading(true);
      // Validate form
      if (!form.firstName || !form.lastName || !form.subject || !form.message) {
        Alert.alert("Error", "Please fill in all required fields");
        setLoading(false);
        return;
      }

      const messageData = {
        firstName: form.firstName,
        lastName: form.lastName,
        subject: form.subject,
        message: form.message,
        email: form.email,
      };

      // Add user ID if logged in
      if (isLoggedIn && user) {
        messageData.userId = user._id;
      }

      const response = await createMessage(messageData);

      if (response.data && response.data.success) {
        Alert.alert("Success", "Your message has been sent successfully");

        // Clear form except user info
        setForm((prevForm) => ({
          firstName: isLoggedIn ? user.firstName : "",
          lastName: isLoggedIn ? user.lastName : "",
          email: isLoggedIn ? user.email : "",
          subject: "",
          message: "",
        }));
      }
    } catch (error) {
      console.error("Send message error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Login Modal
  // const renderLoginModal = () => {
  //   return (
  //     <Modal
  //       visible={showLoginModal}
  //       transparent={true}
  //       animationType="slide"
  //       onRequestClose={() => setShowLoginModal(false)}
  //     >
  //       <View style={styles.modalContainer}>
  //         <View style={styles.modalContent}>
  //           <Text style={styles.modalTitle}>Login</Text>

  //           {loginError ? (
  //             <Text style={styles.errorText}>{loginError}</Text>
  //           ) : null}

  //           <Text style={styles.inputTitle}>Email</Text>
  //           <TextInput
  //             style={styles.input}
  //             placeholder="Enter your email"
  //             value={loginForm.email}
  //             onChangeText={(text) =>
  //               setLoginForm({ ...loginForm, email: text })
  //             }
  //             keyboardType="email-address"
  //             autoCapitalize="none"
  //           />

  //           <Text style={styles.inputTitle}>Password</Text>
  //           <TextInput
  //             style={styles.input}
  //             placeholder="Enter your password"
  //             value={loginForm.password}
  //             onChangeText={(text) =>
  //               setLoginForm({ ...loginForm, password: text })
  //             }
  //             secureTextEntry
  //           />

  //           <View style={styles.modalButtons}>
  //             <TouchableOpacity
  //               style={[
  //                 styles.button,
  //                 { backgroundColor: "#ccc", marginRight: 10 },
  //               ]}
  //               onPress={() => setShowLoginModal(false)}
  //             >
  //               <Text style={styles.buttonText}>Cancel</Text>
  //             </TouchableOpacity>

  //             <TouchableOpacity
  //               style={styles.button}
  //               onPress={handleLogin}
  //               disabled={loading}
  //             >
  //               {loading ? (
  //                 <ActivityIndicator color="#fff" size="small" />
  //               ) : (
  //                 <Text style={styles.buttonText}>Login</Text>
  //               )}
  //             </TouchableOpacity>
  //           </View>

  //           <TouchableOpacity
  //             style={styles.registerLink}
  //             onPress={() => {
  //               setShowLoginModal(false);
  //               navigation.navigate("Register");
  //             }}
  //           >
  //             <Text style={styles.registerText}>
  //               Don't have an account? Register here
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </Modal>
  //   );
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      {/* <Text style={styles.title}>Contact Us</Text> */}
      {/* Account setting */}
      <View style={styles.box}>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 20 }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign
            name="left"
            size={18}
            color="#777290"
            style={{ marginRight: 10 }}
          />

          <Text style={styles.textLeft}>Contact Us</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 12,
          color: "#777e90",
          marginHorizontal: 30,
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Bloom Outfits says your 50% discount on clothes and shoes up to 80% off.
      </Text>

      <ScrollView>
        <View style={styles.content}>
          {/* Contact Information Section */}
          <View style={styles.contactInfo}>
            <Text style={styles.titleContact}>Contact Information</Text>
            <Text style={styles.subtitle}>
              Fill in the form or drop an email
            </Text>

            <View style={styles.infoItem}>
              <FontAwesome name="phone" size={18} color="white" />
              <Text style={styles.infoText}>0328126702</Text>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons name="email" size={18} color="white" />
              <Text style={styles.infoText}>lannthe172785@fpt.edu.vn</Text>
            </View>

            <View style={styles.infoItem}>
              <Entypo name="location-pin" size={18} color="white" />
              <Text style={styles.infoText}>Thạch Thất, Hà Nội</Text>
            </View>

            {/* Login/Logout Button */}
            {!isLoggedIn ? (
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => navigation.navigate("login")}
              >
                <Text style={styles.authButtonText}>Login to contact us</Text>
              </TouchableOpacity>
            ) : (
              ""
            )}
            {/* <TouchableOpacity
              style={styles.authButton}
              onPress={
                isLoggedIn ? handleLogout : () => setShowLoginModal(true)
              }
            >
              <Text style={styles.authButtonText}>
                {isLoggedIn ? "Logout" : "Login to Contact Us"}
              </Text>
            </TouchableOpacity> */}

            {isLoggedIn && user && (
              <Text style={styles.welcomeText}>
                Welcome, {user.firstName} {user.lastName}
              </Text>
            )}
          </View>

          {/* Contact Form Section */}
          <Text style={styles.inputTitle}>First Name</Text>
          <TextInput
            style={[styles.input]}
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(text) => setForm({ ...form, firstName: text })}
            editable={!isLoggedIn} // Disable if logged in
          />

          <Text style={styles.inputTitle}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={(text) => setForm({ ...form, lastName: text })}
            editable={!isLoggedIn} // Disable if logged in
          />

          <Text style={styles.inputTitle}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoggedIn} // Disable if logged in
          />

          <Text style={styles.inputTitle}>Subject </Text>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={form.subject}
            onChangeText={(text) => setForm({ ...form, subject: text })}
          />

          <Text style={styles.inputTitle}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageBox]}
            placeholder="Message"
            multiline
            numberOfLines={4}
            value={form.message}
            onChangeText={(text) => setForm({ ...form, message: text })}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendMessage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ marginBottom: 200 }}>
          <Footer />
        </View>
      </ScrollView>

      {/* Login Modal */}
      {/* {renderLoginModal()} */}
    </SafeAreaView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
  },
  box: {
    width: 350,
    height: 45,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#777e90",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    elevation: 5,
    marginVertical: 9,
  },
  iconLeft: {
    width: 24,
    height: 24,
    textAlign: "center",
    backgroundColor: "#ebf1ff",
    borderRadius: 12,
    paddingTop: 3,
  },
  textLeft: { fontSize: 16, fontWeight: "400" },

  //   CONTENT
  content: {
    // flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#777e90",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: 20,
  },
  contactInfo: {
    backgroundColor: PRIMARY_COLOR,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    height: 410,
  },
  titleContact: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    gap: 10,
    borderWidth: 1,
    borderColor: "white",
    width: 214,
    height: 48,
    borderRadius: 6,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 12,
  },
  infoText: {
    color: "white",
    fontSize: 14,
  },
  form: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#777e90",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: 400,
    color: "#777e90",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F4F5F9",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    color: "#777e90",
    marginBottom: 20,
  },
  messageBox: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: 131,
    height: 48,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputActive: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "#FFF5F7", // Màu nhạt hơn khi active
  },
  // Login Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: PRIMARY_COLOR,
    textDecorationLine: "underline",
  },
  authButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  authButtonText: {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  },
  welcomeText: {
    color: "white",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
