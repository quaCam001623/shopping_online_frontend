import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../common/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const Profile = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <Header />

        <Text style={styles.title}>Profile</Text>

        {/* setting item */}
        <View>
          {/* Account setting */}
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("accountSetting")}
          >
            <View style={{ flexDirection: "row", gap: 20 }}>
              <AntDesign
                name="user"
                size={18}
                color="#777290"
                style={styles.iconLeft}
              />
              <Text style={styles.textLeft}>Account Setting</Text>
            </View>
            <AntDesign name="right" size={18} color="#777290" />
          </TouchableOpacity>

          {/* Order History */}
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("orderHistory")}
          >
            <View style={{ flexDirection: "row", gap: 20 }}>
              <Octicons
                name="history"
                size={18}
                color="#777290"
                style={styles.iconLeft}
              />
              <Text style={styles.textLeft}>Order History</Text>
            </View>
            <AntDesign name="right" size={18} color="#777290" />
          </TouchableOpacity>

          {/* Contact Us */}
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate("contactUs")}
          >
            <View style={{ flexDirection: "row", gap: 20 }}>
              <SimpleLineIcons
                name="envelope-letter"
                size={18}
                color="#777290"
                style={styles.iconLeft}
              />
              <Text style={styles.textLeft}>Contact Us</Text>
            </View>
            <AntDesign name="right" size={18} color="#777290" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: "white",
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
});
