import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PRIMARY_COLOR } from "../../utils/enums";
import ButtonText from "../common/ButtonText";
import ButtonTextWhite from "../common/ButtonTextWhite";
import { useRoute } from "@react-navigation/native";

const Completed = ({ navigation }) => {
  const route = useRoute();
  const { orderId } = route.params;
  console.log("route.params", route.params);
  console.log("route.params.orderId", route.params?.orderId);
  return (
    <SafeAreaView>
      <View styles={styles.container}>
        <Feather
          name="shopping-bag"
          size={137}
          color="black"
          style={{ alignSelf: "center", position: "relative", marginTop: 200 }}
        />
        <AntDesign
          name="checkcircleo"
          size={77}
          color="white"
          style={{
            position: "absolute",
            bottom: 80,
            right: 120,
            backgroundColor: PRIMARY_COLOR,
            borderRadius: 42,
            borderColor: 0,
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginVertical: 30,
          marginLeft: 30,
          textAlign: "center",
          fontFamily: "quicksand",
        }}
      >
        Payment Done {"\n"} Successfully and your{"\n"} order has been placed.
      </Text>
      <View style={{ marginTop: 150 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("orderdetail", { orderId })}
        >
          <ButtonTextWhite text="View Order Details" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <ButtonText text="Continue Shopping" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Completed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
  },
});
