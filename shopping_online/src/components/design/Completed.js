import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PRIMARY_COLOR } from "../../utils/enums";
import ButtonText from "../common/ButtonText";
import ButtonTextWhite from "../common/ButtonTextWhite";
import { useRoute } from "@react-navigation/native";

const Completed = ({ navigation }) => {
  const route = useRoute();
  const { orderId } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNavigation = useCallback(
    async (route, params = {}) => {
      try {
        setLoading(true);
        setError(null);
        await navigation.navigate(route, params);
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
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.container}>
        <Feather
          name="shopping-bag"
          size={137}
          color="black"
          style={styles.shoppingBagIcon}
        />
        <AntDesign
          name="checkcircleo"
          size={77}
          color="white"
          style={styles.checkIcon}
        />
      </View>

      <Text style={styles.successText}>
        Payment Done {"\n"} Successfully and your{"\n"} order has been placed.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleNavigation("orderdetail", { orderId })}
          disabled={loading}
        >
          <ButtonTextWhite text="View Order Details" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNavigation("Main")}
          disabled={loading}
        >
          <ButtonText text="Continue Shopping" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

Completed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      orderId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Completed;

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
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
  },
  shoppingBagIcon: {
    alignSelf: "center",
    position: "relative",
    marginTop: 200,
  },
  checkIcon: {
    position: "absolute",
    bottom: 200,
    left: 80,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 42,
    borderColor: 0,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 30,
    marginLeft: 30,
    textAlign: "center",
    fontFamily: "quicksand",
  },
  buttonContainer: {
    marginTop: 150,
  },
});
