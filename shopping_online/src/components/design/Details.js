import React from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonText from "../common/ButtonText";
import { globalStyles, PRIMARY_COLOR } from "../../utils/enums";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

const Details = () => {
  // const route = useRoute();
  // const { id } = route.params; // Nhận id từ params
  const id = "67c0afbaf78379ad964d7942";
  console.log("id", id);
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["#22DBAF", "#22AFDB", "#012639"];
  return (
    <SafeAreaView>
      <View>
        <Image
          source={require("../../../assets/shirt2.png")}
          style={{ width: "100%", height: 342, objectFit: "cover" }}
        />

        <View style={{ margin: 20, borderRadius: 24, position: "relative" }}>
          <Text style={styles.name}>Full Shirt</Text>
          <Text style={[globalStyles.price]}>Rs. 30000</Text>
          <Feather
            name="heart"
            size={24}
            color="black"
            style={{ position: "absolute", right: 0, top: 10 }}
          />
          {/* Description */}
          <View style={styles.description}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionContent}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Ullamcorper in non at egestas metus auctor ultricies phasellus
              senectus. Turpis orci donec faucibus turpis malesuada sed diam
              potenti nulla.
            </Text>
          </View>

          {/* Size */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sizeTitle}>Size</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
              {sizes.map((item, index) => (
                <View style={styles.itemSize} key={index}>
                  <Text style={{ textAlign: "center", paddingTop: 10 }}>
                    {item}
                  </Text>
                </View>
              ))}
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 5,
                  backgroundColor: PRIMARY_COLOR,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    paddingTop: 10,
                    color: "white",
                  }}
                >
                  2XL
                </Text>
              </View>
            </View>
          </View>

          {/* Colors Available */}
          <View>
            <Text style={styles.colorTitle}>Colors Available:</Text>
            <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
              {colors.map((item, index) => (
                <View
                  style={{
                    width: 38,
                    height: 38,
                    backgroundColor: `${item}`,
                    borderRadius: 19,
                  }}
                  key={index}
                ></View>
              ))}
              <View
                style={{
                  width: 38,
                  height: 38,
                  backgroundColor: "beige",
                  borderRadius: 19,
                  borderWidth: 1,
                  borderColor: PRIMARY_COLOR,
                }}
              >
                <AntDesign
                  name="check"
                  size={24}
                  color="black"
                  style={{ paddingLeft: 8, paddingTop: 4 }}
                />
              </View>
            </View>
          </View>

          {/* Button: Add to card */}
          <ButtonText text="Add To Card" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {},
  name: {
    fontWeight: "bold",
    fontSize: 21,
    lineHeight: 28,
  },
  description: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontWeight: 600,
    fontSize: 17,
    color: "#252525",
    paddingBottom: 5,
  },
  descriptionContent: {
    color: "#505050",
    fontWeight: "normal",
    fontSize: 15,
    lineHeight: 23,
  },
  sizeTitle: {
    color: "#505050",
    fontWeight: "600",
    fontSize: 15,
    paddingTop: 5,
    marginBottom: 10,
  },
  itemSize: {
    width: 38,
    height: 38,
    borderRadius: 5,
    backgroundColor: "#faeef2",
  },
  colorTitle: {
    color: "#505050",
    fontWeight: "600",
    fontSize: 15,
    paddingTop: 5,
  },
});
