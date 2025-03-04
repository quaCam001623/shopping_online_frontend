import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PRIMARY_COLOR } from "../../utils/enums";
import HeaderNav from "../common/HeaderNav";
import ButtonText from "../common/ButtonText";
import ButtonTextWhite from "../common/ButtonTextWhite";

const Completed = () => {
  return (
    <SafeAreaView>
      <HeaderNav />

      <View
        styles={{
          flex: 1,
          alignItems: "center",
          alignSelf: "center",
        }}
      >
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
        <ButtonTextWhite text="View Order Details" />
        <ButtonText text="Continue Shopping" />
      </View>
    </SafeAreaView>
  );
};

export default Completed;
