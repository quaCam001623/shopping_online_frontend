import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import TopLeft from "./TopLeft";
import { AuthContext } from "../../common/context/AuthContext";

const Header = ({ navigation }) => {
  const { cards } = useContext(AuthContext);
  const [numberCard, setNumberCard] = useState(0);
  useEffect(() => {
    if (cards) {
      setNumberCard(cards.length);
    }
  }, [cards]); // Runs only when `cards` changes
  return (
    <View style={styles.container}>
      <TopLeft />
      <View style={styles.topRight}>
        <Ionicons name="notifications-outline" size={24} color="black" />
        <AntDesign name="hearto" size={24} color="black" />
        <TouchableOpacity onPress={() => navigation.navigate("checklist")}>
          <Feather
            name="shopping-bag"
            size={24}
            color="black"
            style={{ position: "relative" }}
          />
          <View style={styles.numberContainer}></View>
          <Text style={styles.numberCard}>{numberCard ? numberCard : 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
    height: 54,
  },

  topRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  numberContainer: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: "#FF937B",
    position: "absolute",
    bottom: 10,
    left: 10,
    margin: 2,
  },
  numberCard: {
    position: "absolute",
    bottom: 13,
    left: 18,
    color: "white",
  },
});
