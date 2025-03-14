import React, { useContext, useState } from "react";
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
import RNPickerSelect from "react-native-picker-select";
import { AuthContext } from "../../../common/context/AuthContext";
import ShowMessage from "../../../funtions/Message";
import { getUserById, updateUser } from "../../../services/userService";

const AccountSetting = ({ navigation }) => {
  const { user, userId, logout } = useContext(AuthContext);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dob?.slice(0, 10) || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState(user?.gender || "");

  //   PASSWORD
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  // console.log("user", user);

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.cancelled && !result.canceled) {
  //     setProfileImage(result.uri);
  //   }
  // };

  // const removeImage = () => {
  //   setProfileImage(null);
  // };

  const saveChanges = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !dateOfBirth ||
      !gender
    ) {
      ShowMessage("error", "Error", "Please input all the fields");
      return;
    }
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateOfBirth)) {
      ShowMessage(
        "error",
        "Error",
        "You have to enter date with the format YYYY-MM-DD"
      );
      return;
    }

    const dob = new Date(dateOfBirth); // Chuyển đổi đúng format
    // Dùng biến tạm thay vì setState (vì setState không cập nhật ngay)
    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      dob, // Đảm bảo dùng giá trị mới
      gender,
      profileImage,
    };

    const response = await updateUser(userId, userData);
    if (response) {
      await getUserById(userId);
      ShowMessage(
        "success",
        "Success",
        "Update your personal information successfully"
      );
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      ShowMessage("error", "Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      ShowMessage("error", "Error", "New passwords do not match");
      return;
    }

    try {
      const response = await updateUser(userId, {
        currentPassword,
        newPassword,
      });
      if (response) {
        ShowMessage("success", "Success", "Password updated successfully");
      } else {
        ShowMessage("error", "Error", data.message);
      }
    } catch (error) {
      ShowMessage("error", "Error", "Something went wrong");
    }
  };

  const handleLogout = () => {
    try {
      logout();
      navigation.navigate("login");
    } catch (error) {
      ShowMessage("error", "Error", "Failed to logout");
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <Header navigation={navigation} />
        <ScrollView>
          {/* <Text style={styles.title}>Account Setting</Text> */}

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

              <Text style={styles.textLeft}>Account Setting</Text>
            </TouchableOpacity>
          </View>

          {/* User Profile Header */}
          <View style={styles.userProfileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  user?.avatar
                    ? { uri: user.avatar }
                    : require("../../../../assets/avatar.jpg")
                }
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.userInfoContainer}>
              {user ? (
                <>
                  <Text
                    style={styles.userName}
                  >{`${firstName} ${lastName}`}</Text>
                  <Text style={styles.userEmail}>{email}</Text>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                  >
                    <Feather name="log-out" size={16} color="#F44336" />
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.userName}>Guest User</Text>
                  <Text style={styles.userEmail}>
                    Please login to access your account
                  </Text>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                  >
                    <Feather name="log-in" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* my profile */}
          {user && (
            <>
              <View style={styles.profileContainer}>
                <View style={styles.profileBox}>
                  <View style={styles.profileHeader}>
                    <Text style={styles.profileTitle}>My profile</Text>
                  </View>

                  {/* Profile Image */}
                  {/* <View style={styles.imageBox}>
                    <Image
                      source={
                        user?.avatar
                          ? { uri: user.avatar }
                          : require("../../../../assets/avatar.jpg")
                      }
                      style={styles.image}
                    />
                    <View>
                      <View style={styles.boxRight}>
                        <TouchableOpacity>
                          <Text style={styles.uploadImage}>
                            Upload new photo
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Text style={styles.removeImage}>Remove</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={{ fontSize: 11, color: "#b1b5c3" }}>
                        Image formats with max size of 3mb
                      </Text>
                    </View>
                  </View> */}

                  {/* FirstName */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>

                  {/* LastName */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last name</Text>
                    <TextInput
                      style={styles.input}
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>

                  {/* PHoneNumber */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone number</Text>
                    <TextInput
                      style={styles.input}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                  </View>

                  {/* Date */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Date Of Birth</Text>
                    <TextInput
                      style={styles.input}
                      value={dateOfBirth}
                      onChangeText={setDateOfBirth}
                      placeholder="YYYY-MM-DD"
                    />
                  </View>

                  {/* Email */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email address</Text>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                    />
                  </View>

                  {/* Gender */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender</Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#e8e8e8",
                        borderRadius: 5,
                        color: "#777490",
                      }}
                    >
                      <RNPickerSelect
                        onValueChange={(value) => setGender(value)}
                        items={[
                          { label: "Male", value: "male" },
                          { label: "Female", value: "female" },
                          { label: "Other", value: "other" },
                        ]}
                        placeholder={{ label: "Select gender", value: null }}
                        value={gender}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveChanges}
                  >
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
                      <TouchableOpacity
                        onPress={() => setSecureNew(!secureNew)}
                      >
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

                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleChangePassword}
                    >
                      <Text style={styles.saveButtonText}>Save Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
          {/* Footer */}
          <Footer />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AccountSetting;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
    marginBottom: 20,
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
  // User Profile Header
  userProfileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#777290",
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  logoutText: {
    color: "#F44336",
    marginLeft: 8,
    fontWeight: "500",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F7FF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  loginText: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
    fontWeight: "500",
  },
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
