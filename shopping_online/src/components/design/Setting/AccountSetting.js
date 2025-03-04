import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../common/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PRIMARY_COLOR } from "../../../utils/enums";
import Footer from "../../common/Footer";
import Feather from "@expo/vector-icons/Feather";

const AccountSetting = () => {
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Mecheal");
  const [location, setLocation] = useState("Sylhet, Bangladesh");
  const [dateOfBirth, setDateOfBirth] = useState("07.12.1997");
  const [email, setEmail] = useState("uihutofficial@gmail.com");
  const [gender, setGender] = useState("Male");
  const [profileImage, setProfileImage] = useState(null);
  //   PASSWORD
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  const saveChanges = () => {
    // Implement your save logic here (e.g., API call)
    console.log("Profile saved:", {
      firstName,
      lastName,
      location,
      dateOfBirth,
      email,
      gender,
      profileImage,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <Text style={styles.title}>Account Setting</Text>

        {/* Account setting */}
        <View style={styles.box}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <AntDesign
              name="user"
              size={18}
              color="#777290"
              style={styles.iconLeft}
            />
            <Text style={styles.textLeft}>Account Setting</Text>
          </View>
          <TouchableOpacity>
            <AntDesign name="right" size={18} color="#777290" />
          </TouchableOpacity>
        </View>

        {/* my profile */}
        <View style={styles.profileContainer}>
          <View style={styles.profileBox}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>My profile</Text>
            </View>

            <View style={styles.imageBox}>
              <Image
                source={require("../../../../assets/avatar.jpg")}
                style={styles.image}
              />
              <View>
                <View style={styles.boxRight}>
                  <Text style={styles.uploadImage}>Upload new photo</Text>
                  <Text style={styles.removeImage}>Remove</Text>
                </View>

                <Text style={{ fontSize: 11, color: "#b1b5c3" }}>
                  Image formats with max size of 3mb
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date Of Birth</Text>
              <TextInput
                style={styles.input}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                value={gender}
                onChangeText={setGender}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
              <Text style={styles.saveButtonText}>Save Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Password */}
        <View style={styles.passwordBox}>
          <View style={styles.passwordContainer}>
            <Text style={styles.titlePassword}>Change Password</Text>

            {/* Current Password */}
            <Text style={styles.labelPassword}>Current password</Text>
            <View style={styles.inputPasswordContainer}>
              <TextInput
                style={styles.inputPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={secureCurrent}
              />
              <TouchableOpacity
                onPress={() => setSecureCurrent(!secureCurrent)}
              >
                <Feather
                  name={secureCurrent ? "eye-off" : "eye"}
                  size={20}
                  color="#777490"
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View>
              <Text style={styles.labelPassword}>New password</Text>
              <View style={styles.inputPasswordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={secureNew}
                />
                <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
                  <Feather
                    name={secureNew ? "eye-off" : "eye"}
                    size={20}
                    color="#777490"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={styles.labelPassword}>Confirm password</Text>
              <View style={styles.inputPasswordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={secureConfirm}
                />
                <TouchableOpacity
                  onPress={() => setSecureConfirm(!secureConfirm)}
                >
                  <Feather
                    name={secureConfirm ? "eye-off" : "eye"}
                    size={20}
                    color="#777490"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Footer */}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSetting;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: "white",
    marginBottom: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 30,
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
    marginTop: 9,
    marginBottom: 30,
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
  profileContainer: {
    padding: 1,
    borderRadius: 20,
    shadowColor: "#777490",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  profileBox: {
    // flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileHeader: {
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  imageBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 40,
    padding: 10,
    backgroundColor: "white",
    shadowColor: "#777490",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
    borderRadius: 8,
    marginBottom: 20,
  },
  image: { width: 58, height: 58, borderRadius: 10 },
  boxRight: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 10,
  },
  uploadImage: {
    width: 120,
    height: 28,
    backgroundColor: PRIMARY_COLOR,
    color: "white",
    borderRadius: 6,
    paddingVertical: 16,
    paddingTop: 6,
    paddingBottom: 5,
    textAlign: "center",
    fontSize: 11,
  },
  removeImage: {
    width: 64,
    height: 28,
    borderWidth: 1,
    borderColor: "#f65540",
    backgroundColor: "white",
    color: "#f65540",
    borderRadius: 4,
    fontSize: 11,
    textAlign: "center",
    paddingTop: 6,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 5,
    padding: 10,
    color: "#777490",
  },
  saveButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 11,
    borderRadius: 10,
    alignItems: "center",
    width: 155,
    height: 48,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  //   PASSWORD
  passwordBox: {
    marginVertical: 40,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#777490",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  passwordContainer: {
    padding: 10,
    // backgroundColor: "#fff",
    flex: 1,
  },
  titlePassword: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 20,
    lineHeight: 24,
  },
  labelPassword: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 5,
    color: "#777490",
  },
  inputPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
});
