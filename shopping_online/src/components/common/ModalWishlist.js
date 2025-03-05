import React from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { globalStyles, PRIMARY_COLOR } from "../../utils/enums";
import AntDesign from "@expo/vector-icons/AntDesign";

const ModalWishlist = ({ modalVisible, setModalVisible }) => {
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["#22DBAF", "#22AFDB", "#012639"];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Image
              source={require("../../../assets/shirt1.png")}
              style={styles.image}
            />
            <View>
              <Text style={styles.name}>Full Shirt</Text>
              <Text style={[globalStyles.price]}>Rs. 30000</Text>
            </View>

            {/* quantity */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                // position: "absolute",
                // right: 0,
                // top: 10,
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
          {/* <ButtonText text="Add To Card" /> */}
          <View style={styles.buttonBox}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Add To Card</Text>
            </TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalWishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  content: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: 78,
    height: 93,
    borderRadius: 15,
  },
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
  buttonBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    marginVertical: 20,
  },
  button: {
    width: 134,
    height: 62,
    borderRadius: 10,
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
});
