import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRIMARY_COLOR } from "../../utils/enums";
import { AuthContext } from "../../common/context/AuthContext";
import { CheckBox } from "react-native-elements";
import { createAddress } from "../../services/shippingAddressService";
import ShowMessage from "../../funtions/Message";

//{ isVisible, onClose, onSave }
const AddAddressModal = ({ isVisible, setModalVisible, onAddNewAddress }) => {
  const { userId } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setDefault] = useState(false);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const onClose = () => {
    setModalVisible(false);
    setErrors({});
  };
  const onSave = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!validateInputs()) return; // Nếu có lỗi, không gửi API
    try {
      const newAddress = {
        userId,
        fullName,
        phoneNumber,
        address,
        city,
        country,
        postalCode,
        isDefault,
      };
      const response = await createAddress(newAddress);
      if (response) {
        onAddNewAddress();
        onSave();
        onClose(); // Đóng modal sau khi lưu
      } else {
        ShowMessage("error", "Error", "Fail to add new address");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="Open Modal" onPress={() => setModalVisible(true)} />
      <Modal isVisible={isVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add New Address</Text>
          <TextInput
            style={[
              styles.input,
              errors.fullName && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
          <TextInput
            style={[
              styles.input,
              errors.phoneNumber && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
          <TextInput
            style={[
              styles.input,
              errors.address && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
          <TextInput
            style={[
              styles.input,
              errors.city && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          <TextInput
            style={[
              styles.input,
              errors.country && { borderColor: "red", borderWidth: 1 },
            ]}
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />
          {errors.country && (
            <Text style={styles.errorText}>{errors.country}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="number-pad"
          />
          <CheckBox
            title="Set as default"
            checked={isDefault}
            onPress={() => setDefault(!isDefault)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
              <Text style={styles.buttonTextSave}>Save</Text>
            </TouchableOpacity>
            {/* <Button title="Close" onPress={() => setModalVisible(false)} /> */}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddAddressModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonCancel: {
    // backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
  },
  buttonSave: {
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  },
  buttonTextSave: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
