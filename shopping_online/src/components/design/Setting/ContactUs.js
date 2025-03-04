import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../common/Header";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import Footer from "../../common/Footer";
import { PRIMARY_COLOR } from "../../../utils/enums";

const ContactUs = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    message: "",
  });
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.title}>Contact Us</Text>
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

      {/* Contact us */}
      <View style={styles.box}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <SimpleLineIcons
            name="envelope-letter"
            size={18}
            color="#777290"
            style={styles.iconLeft}
          />
          <Text style={styles.textLeft}>Contact Us</Text>
        </View>
        <TouchableOpacity>
          <AntDesign name="right" size={18} color="#777290" />
        </TouchableOpacity>
      </View>

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
              <Text style={styles.infoText}>+01700000000</Text>
            </View>

            <View style={styles.infoItem}>
              <MaterialIcons name="email" size={18} color="white" />
              <Text style={styles.infoText}>uihuotoflex@gmail.com</Text>
            </View>

            <View style={styles.infoItem}>
              <Entypo name="location-pin" size={18} color="white" />
              <Text style={styles.infoText}>Sylhet, Bangladesh</Text>
            </View>
          </View>

          {/* Contact Form Section */}

          <Text style={styles.inputTitle}>First Name</Text>
          <TextInput
            style={[styles.input]}
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(text) => setForm({ ...form, firstName: text })}
          />
          <Text style={styles.inputTitle}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={(text) => setForm({ ...form, lastName: text })}
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

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ marginBottom: 150 }}>
          <Footer />
        </View>
      </ScrollView>
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
});
