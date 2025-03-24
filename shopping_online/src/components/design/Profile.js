import React, { useCallback, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../common/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { PRIMARY_COLOR } from "../../utils/enums";

const Profile = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNavigation = useCallback(
    async (route) => {
      try {
        setLoading(true);
        setError(null);
        await navigation.navigate(route);
      } catch (err) {
        console.error(`Error navigating to ${route}:`, err);
        setError(`Failed to navigate to ${route}`);
      } finally {
        setLoading(false);
      }
    },
    [navigation]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header navigation={navigation} />

        <Text style={styles.title}>Profile</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* setting item */}
        <View>
          {/* Account setting */}
          <TouchableOpacity
            style={styles.box}
            onPress={() => handleNavigation("accountSetting")}
            disabled={loading}
          >
            <View style={styles.boxContent}>
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
            onPress={() => handleNavigation("orderHistory")}
            disabled={loading}
          >
            <View style={styles.boxContent}>
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
            onPress={() => handleNavigation("contactUs")}
            disabled={loading}
          >
            <View style={styles.boxContent}>
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

Profile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
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
  boxContent: {
    flexDirection: "row",
    gap: 20,
  },
  iconLeft: {
    width: 24,
    height: 24,
    textAlign: "center",
    backgroundColor: "#ebf1ff",
    borderRadius: 12,
    paddingTop: 3,
  },
  textLeft: {
    fontSize: 16,
    fontWeight: "400",
  },
});
