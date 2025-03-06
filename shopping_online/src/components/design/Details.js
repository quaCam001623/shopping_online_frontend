import React, { useContext, useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles, PRIMARY_COLOR } from "../../utils/enums";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { getProductById } from "../../services/productService";
import ShowMessage from "../../funtions/Message";
import { createCard, getCards, updateCard } from "../../services/cardService";
import { AuthContext } from "../../common/context/AuthContext";

const Details = ({ navigation }) => {
  const route = useRoute();
  const { id } = route.params; // Nhận id từ params
  const [productDetails, setProductDetails] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const { userId } = useContext(AuthContext);
  const [cards, setCards] = useState([]);

  // console.log("userId", userId);

  useEffect(() => {
    const fetchCarts = async (userId) => {
      try {
        const response = await getCards(userId);
        if (response) {
          setCards(response);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    if (userId) {
      fetchCarts(userId);
    }
  }, [userId]);

  // const id = "67c0afbaf78379ad964d7942";
  // console.log("id", id);
  useEffect(() => {
    const fetch = async () => {
      const response = await getProductById(id);
      if (response) {
        setProductDetails(response);
      }
    };
    fetch();
  }, [id]);

  // console.log("product Details", productDetails);

  useEffect(() => {
    if (selectedSize && productDetails.productDetails) {
      const colors = productDetails.productDetails
        .filter((item) => item.size === selectedSize && item.stock > 0)
        .map((item) => item.color);
      setAvailableColors(colors);
    }
  }, [selectedSize, productDetails]);

  const handleSelectedSize = (item) => {
    setSelectedSize(item);
    setSelectedColor(null);
  };

  const handleAddToCart = async (text) => {
    try {
      if (!selectedColor || !selectedSize) {
        ShowMessage("error", "Error", "You have to select size and color!!!");
        return;
      }

      if (!userId) {
        navigation.navigate("login");
        return;
      }

      const selectedProductDetail = productDetails.productDetails.find(
        (item) => item.size === selectedSize && item.color === selectedColor
      );

      const existCard = cards.find(
        (item) => item.productDetailId._id === selectedProductDetail._id
      );

      if (text === "addtocard") {
        ShowMessage("success", "Successfully", "Add to cart successfully");
        if (existCard) {
          await updateCard(existCard._id, { quantity: existCard.quantity + 1 });
        } else {
          await addtoCard(userId, {
            productDetailId: selectedProductDetail._id,
          });
        }
      } else if (text === "buy") {
        if (existCard) {
          navigation.navigate("checklist", { cardId: existCard._id });
        } else {
          const response = await createCard(userId, {
            productDetailId: selectedProductDetail._id,
          });

          if (response && response.data.data) {
            const newCardId = response.data.data._id;
            navigation.navigate("checklist", { cardId: newCardId });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const sizes = ["S", "M", "L", "XL"];

  return (
    <SafeAreaView>
      {productDetails && (
        <View style={{ backgroundColor: "white" }}>
          <Image
            source={
              productDetails?.images
                ? { uri: productDetails.images[0] }
                : require("../../../assets/shirt2.png")
            }
            style={styles.imageDetail}
          />

          <AntDesign
            name="leftcircle"
            size={25}
            color={PRIMARY_COLOR}
            style={styles.leftCircle}
            onPress={() => navigation.goBack()}
          />

          <View
            style={{
              margin: 20,
              borderRadius: 24,
              position: "relative",
              backgroundColor: "white",
            }}
          >
            <Text style={styles.name}>{productDetails?.name}</Text>
            <Text style={[globalStyles.price]}>
              Rs. {productDetails?.price}
            </Text>
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
                {productDetails?.description}
              </Text>
            </View>

            {/* Size */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sizeTitle}>Size</Text>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
                {sizes.map((item, index) => (
                  <TouchableOpacity
                    style={[
                      styles.itemSize,
                      selectedSize == item
                        ? { backgroundColor: PRIMARY_COLOR }
                        : { backgroundColor: "#e8e8e8" },
                    ]}
                    key={index}
                    onPress={() => handleSelectedSize(item)}
                  >
                    <Text
                      style={[
                        { textAlign: "center", paddingTop: 10 },
                        selectedSize == item && { color: "white" },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
                {/* <View
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
                </View> */}
              </View>
            </View>

            {/* Colors Available */}
            <View>
              <Text style={styles.colorTitle}>Colors Available:</Text>
              <View
                style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}
              >
                {productDetails?.productDetails &&
                  productDetails?.productDetails.map((item, index) => (
                    <TouchableOpacity
                      style={[
                        styles.colorCircle,
                        { backgroundColor: item.color },
                        !availableColors.includes(item.color) &&
                          styles.disabledColor,
                      ]}
                      key={index}
                      disabled={!availableColors.includes(item.color)}
                      onPress={() => setSelectedColor(item.color)}
                    >
                      {selectedColor && item.color == selectedColor && (
                        <AntDesign
                          name="check"
                          size={24}
                          color="white"
                          style={{ paddingLeft: 8, paddingTop: 4 }}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            {/* Add to card */}
            <View style={styles.buttonBox}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleAddToCart("addtocard")}
              >
                <Text style={styles.buttonText}>Add To Card</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleAddToCart("buy")}
              >
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {},
  imageDetail: {
    width: "100%",
    height: 342,
    resizeMode: "cover",
    marginTop: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 21,
    lineHeight: 28,
    marginVertical: 10,
  },
  description: {
    marginTop: 20,
    height: 115,
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
    // backgroundColor: "#faeef2",
  },
  colorTitle: {
    color: "#505050",
    fontWeight: "600",
    fontSize: 15,
    paddingTop: 5,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  disabledColor: {
    opacity: 0.3, // Làm mờ màu không có hàng
  },
  buttonBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    // marginVertical: 20,
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
  leftCircle: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1000,
    width: 50,
  },
});
