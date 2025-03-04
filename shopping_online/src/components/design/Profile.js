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

        <Text style={styles.title}>Account Setting</Text>

        {/* setting item */}
        <View>
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

          {/* Order History */}
          <View style={styles.box}>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <Octicons
                name="history"
                size={18}
                color="#777290"
                style={styles.iconLeft}
              />
              <Text style={styles.textLeft}>Order History</Text>
            </View>
            <TouchableOpacity>
              <AntDesign name="right" size={18} color="#777290" />
            </TouchableOpacity>
          </View>

          {/* Contact Us */}
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
