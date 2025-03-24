import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles, PRIMARY_COLOR } from "../../utils/enums";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { getProductById } from "../../services/productService";
import ShowMessage from "../../funtions/Message";
import { createCard, getCards, updateCard } from "../../services/cardService";
import { AuthContext } from "../../common/context/AuthContext";
import {
  createWishlist,
  deleteWishlist,
  getWishlistByUser,
} from "../../services/wishlistService";

const Details = ({ navigation }) => {
  const route = useRoute();
  const { id } = route.params;
  const [productDetails, setProductDetails] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const { userId, cards, setCards } = useContext(AuthContext);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [allWishlist, setAllWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = useCallback(async (userId) => {
    try {
      const response = await getWishlistByUser(userId);
      if (response) {
        setAllWishlist(response);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, []);

  useEffect(() => {
    if (userId) fetchWishlist(userId);
  }, [userId, fetchWishlist]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getProductById(id);
        if (response) {
          setProductDetails(response);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (allWishlist && productDetails) {
      const inWishlist = allWishlist.find((item) => item.productId._id === id);
      setIsInWishlist(!!inWishlist);
    }
  }, [allWishlist, productDetails, id]);

  useEffect(() => {
    if (selectedSize && productDetails.productDetails) {
      const colors = productDetails.productDetails
        .filter((item) => item.size === selectedSize && item.stock > 0)
        .map((item) => item.color);
      setAvailableColors(colors);
    }
  }, [selectedSize, productDetails]);

  const handleSelectedSize = useCallback((item) => {
    setSelectedSize(item);
    setSelectedColor(null);
  }, []);

  const handleAddToCart = useCallback(
    async (text) => {
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
            await updateCard(existCard._id, {
              quantity: existCard.quantity + 1,
            });
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
        console.error("Error adding to cart:", error);
        ShowMessage("error", "Error", "Failed to add to cart");
      }
    },
    [selectedColor, selectedSize, userId, productDetails, cards, navigation]
  );

  const handleWishlistToggle = useCallback(async () => {
    try {
      if (!userId) {
        navigation.navigate("login");
        return;
      }

      if (isInWishlist) {
        await deleteWishlist(userId, id);
        setIsInWishlist(false);
        fetchWishlist(userId);
        ShowMessage("success", "Removed", "Removed from wishlist");
      } else {
        const response = await createWishlist({
          userId,
          productId: id,
        });
        if (response) {
          setIsInWishlist(true);
          fetchWishlist(userId);
          ShowMessage("success", "Added", "Added to wishlist");
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      ShowMessage("error", "Error", "Failed to update wishlist");
    }
  }, [userId, id, isInWishlist, fetchWishlist, navigation]);

  const sizes = useMemo(() => ["S", "M", "L", "XL"], []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaView>
      {productDetails && (
        <View style={styles.container}>
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

          <View style={styles.contentContainer}>
            <Text style={styles.name}>{productDetails?.name}</Text>
            <Text style={[globalStyles.price]}>
              Rs. {productDetails?.price}
            </Text>
            <Feather
              name="heart"
              size={24}
              color={isInWishlist ? PRIMARY_COLOR : "black"}
              style={styles.heartIcon}
              onPress={handleWishlistToggle}
            />

            <View style={styles.description}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionContent}>
                {productDetails?.description}
              </Text>
            </View>

            <View style={styles.sizeContainer}>
              <Text style={styles.sizeTitle}>Size</Text>
              <View style={styles.sizeList}>
                {sizes.map((item, index) => (
                  <TouchableOpacity
                    style={[
                      styles.itemSize,
                      selectedSize === item
                        ? { backgroundColor: PRIMARY_COLOR }
                        : { backgroundColor: "#e8e8e8" },
                    ]}
                    key={index}
                    onPress={() => handleSelectedSize(item)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === item && styles.selectedSizeText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

Details.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default Details;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageDetail: {
    width: "100%",
    height: 400,
    objectFit: "cover",
  },
  leftCircle: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  contentContainer: {
    margin: 20,
    borderRadius: 24,
    position: "relative",
    backgroundColor: "white",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  heartIcon: {
    position: "absolute",
    right: 0,
    top: 10,
  },
  description: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionContent: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  sizeContainer: {
    marginTop: 20,
  },
  sizeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sizeList: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  itemSize: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeText: {
    textAlign: "center",
    paddingTop: 10,
  },
  selectedSizeText: {
    color: "white",
  },
});
