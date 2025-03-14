import React, { useContext, useState, useEffect } from "react";
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
import ShowMessage from "../../funtions/Message";
import { AuthContext } from "../../common/context/AuthContext";
import { updateCard, addtoCard, createCard } from "../../services/cardService";
const ModalWishlist = ({
  modalVisible,
  setModalVisible,
  productDetails,
  navigation,
}) => {
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["#22DBAF", "#22AFDB", "#012639"];
  const { cards, userId } = useContext(AuthContext);

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [availableColors, setAvailableColors] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    if (selectedSize && productDetails?.productDetails) {
      const colors = productDetails?.productDetails
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
      // Close the modal after action
      setModalVisible(false);
    } catch (error) {
      console.log(error.message);
    }
  };

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
      {productDetails && (
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
                style={styles.image}
                // source={item.productId.images[0]}
                source={
                  productDetails?.images.length > 0
                    ? { uri: productDetails.images[0] }
                    : require("../../../assets/icon.png")
                }
              />
              <View>
                <Text style={styles.name}>{productDetails.name}</Text>
                <Text style={[globalStyles.price]}>
                  Rs. {productDetails.price}
                </Text>
              </View>

              {/* Close Modal */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  // position: "absolute",
                  // right: 0,
                  // top: 10,
                }}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <AntDesign name="close" size={24} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.description}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionContent}>
                {productDetails.description}
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

            {/* Button: Add to card */}

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

  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    // borderColor: "#e8e8e8",
    // borderWidth: 1,
  },
  disabledColor: {
    opacity: 0.3, // Làm mờ màu không có hàng
  },
});
