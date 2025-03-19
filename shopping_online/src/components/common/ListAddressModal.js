import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRIMARY_COLOR } from "../../utils/enums";

const ListAddressModal = ({
  address,
  modalAddress,
  setModalAddress,
  chooseAddress,
  setChooseAddress,
  handleChooseAddress,
}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal visible={modalAddress} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chọn địa chỉ</Text>
          <ScrollView>
            {address.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={[
                  styles.addressBox,
                  chooseAddress?._id === item._id && styles.addressBoxActive,
                ]}
                onPress={() => {
                  setChooseAddress(item);
                  //   setModalVisible(false);
                }}
              >
                <RadioButton
                  value={item._id}
                  status={
                    chooseAddress?._id === item._id ? "checked" : "unchecked"
                  }
                />
                <View>
                  <Text>{item.fullName}</Text>
                  <Text>
                    {item.address}, {item.city}, {item.country}
                  </Text>
                  <Text>{item.phoneNumber}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => setModalAddress(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSave}
              onPress={() => handleChooseAddress(chooseAddress)}
            >
              <Text style={styles.buttonTextSave}>Save</Text>
            </TouchableOpacity>
            {/* <Button title="Close" onPress={() => setModalVisible(false)} /> */}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ListAddressModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  addressBoxActive: {
    backgroundColor: "#ccc",
    color: "white",
    borderRadius: 10,
  },
});
