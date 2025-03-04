import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { product } from "../../utils/data";
import Feather from "@expo/vector-icons/Feather";
import { PRIMARY_COLOR } from "../../utils/enums";
import HeaderNav from "../common/HeaderNav";
import ButtonText from "../common/ButtonText";

const CheckList = () => {
  return (
    <View style={styles.container}>
      <HeaderNav screen="Shopping Bag" />
      <View style={{ height: 400, marginVertical: 20 }}>
        <ScrollView>
          {product.slice(0, 3).map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 15,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 3,
                  backgroundColor: PRIMARY_COLOR,
                }}
              >
                <Feather name="check" size={20} color="white" />
              </View>
              <Image style={styles.image} source={item.img} />
              <View style={{ width: 150, gap: 5 }}>
                <Text>{item.name}</Text>
                <Text>Rs. {item.price}</Text>

                {/* quantity */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <View
                    style={{
                      width: 31,
                      height: 30,
                      borderRadius: 16,
                      backgroundColor: "#e8e8e8",
                      position: "relative",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        position: "absolute",
                        top: 5,
                        right: 11,
                      }}
                    >
                      +
                    </Text>
                  </View>
                  <Text>1</Text>
                  <View
                    style={{
                      width: 31,
                      height: 30,
                      borderRadius: 16,
                      backgroundColor: "#e8e8e8",
                      position: "relative",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        position: "absolute",
                        top: 5,
                        right: 11,
                      }}
                    >
                      -
                    </Text>
                  </View>
                </View>
              </View>

              {/* size & delete */}
              <View>
                <View
                  style={{
                    width: 31,
                    height: 30,
                    borderRadius: 16,
                    backgroundColor: "#24232B",
                    position: "relative",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      position: "absolute",
                      top: 5,
                      right: 11,
                    }}
                  >
                    S
                  </Text>
                </View>
                <Feather
                  name="trash-2"
                  size={24}
                  color={PRIMARY_COLOR}
                  style={{ paddingVertical: 10, marginLeft: 4 }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* total money */}
      <View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#ccc",
            width: 321,
            alignSelf: "center",
            paddingVertical: 20,
          }}
        ></View>
        <View style={styles.viewTotal}>
          <Text style={styles.text}>Sub Total</Text>
          <Text style={styles.number}>60.000 VNĐ</Text>
        </View>
        <View style={styles.viewTotal}>
          <Text style={styles.text}>Shipping</Text>
          <Text style={styles.number}>15.000 VNĐ</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 40,
          }}
        >
          <Text style={styles.text}>Bag Total</Text>
          <Text style={styles.total}>75.000 VNĐ</Text>
        </View>

        <ButtonText text="Proceed to Checkout" />
      </View>
    </View>
  );
};

export default CheckList;

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  image: {
    width: 77,
    height: 85,
    borderRadius: 15,
    marginRight: 20,
  },
  viewTotal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
  number: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  total: {
    fontSize: 30,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
});
