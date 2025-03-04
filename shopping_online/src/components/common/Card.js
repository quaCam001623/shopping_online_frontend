import React from "react";
import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

const Card = ({ item }) => {
  const handleCLick = () => {
    console.log("detail item", item);
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.item}
        key={item._id}
        onPress={() => handleCLick()}
      >
        <Image
          style={styles.image}
          source={
            item.images.length > 0
              ? { uri: item.images[0] }
              : require("../../../assets/coat.png")
          }
        />

        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}> Rs. {item.price}</Text>
        <View style={styles.heart}></View>
        <Entypo
          name="heart-outlined"
          size={24}
          color="black"
          style={{ position: "absolute", top: 35, right: 34 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  image: {
    width: 151,
    height: 199,
    borderRadius: 10,
    objectFit: "cover",
  },
  heart: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "white",
    position: "absolute",
    top: 30,
    right: 30,
  },
  name: {
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    fontWeight: "400",
    fontSize: 14,
    color: "#DB3022",
  },
  item: {
    position: "relative",
    width: "45%",
    paddingVertical: 20,
    paddingLeft: 15,
  },
});
