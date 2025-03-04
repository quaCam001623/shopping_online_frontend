import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TopLeft from "./TopLeft";

const Footer = () => {
  const services = [
    "Trip Planner",
    "Tour Planning",
    "Tour Guide",
    "Tour Package",
    "Tour Advice",
  ];
  const supports = [
    "Account",
    "Legal",
    "Contact",
    "Terms & Condition",
    "Privacy Policy",
  ];
  const business = [
    "Success",
    "About Bloom",
    "Blog",
    "Information",
    "Travel Guide",
  ];
  return (
    <View style={styles.container}>
      <TopLeft />
      <View style={{ height: 60, paddingTop: 20 }}>
        <Text style={{ fontSize: 14, color: "#353945" }}>
          Similarly, a loan taken out to buy a car may be secured by the car.
          The duration of the loan.
        </Text>
      </View>
      <View>
        <Text style={styles.text}>Services</Text>
        {services.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item}
          </Text>
        ))}
      </View>
      <View>
        <Text style={styles.text}>Support</Text>
        {supports.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item}
          </Text>
        ))}
      </View>
      <View>
        <Text style={styles.text}>Business</Text>
        {business.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    justifyContent: "start",
  },
  text: {
    width: 100,
    height: 36,
    color: "#353945",
    fontWeight: "500",
    fontSize: 24,
    marginTop: 20,
  },
  item: {
    height: 24,
    color: "#777E90",
    opacity: 0.8,
    fontSize: 16,
    fontWeight: "normal",
    marginVertical: 5,
  },
});
