import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import Header from "../common/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PRIMARY_COLOR } from "../../utils/enums";
import ModalWishlist from "../common/ModalWishlist";
import { AuthContext } from "../../common/context/AuthContext";
import { getProductById } from "../../services/productService";
import {
  deleteWishlist,
  getWishlistByUser,
} from "../../services/wishlistService";

const WishList = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  const fetchProductDetails = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductById(productId);
      if (!response) {
        throw new Error("Product not found");
      }
      setProductDetails(response);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlistByUser(userId);
      if (!response) {
        throw new Error("Wishlist not found");
      }
      setWishlist(response);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleOpenModal = useCallback(
    (productId) => {
      setModalVisible(true);
      fetchProductDetails(productId);
    },
    [fetchProductDetails]
  );

  const deleteProduct = useCallback(
    async (productId) => {
      try {
        setLoading(true);
        setError(null);
        await deleteWishlist(userId, productId);
        await fetchWishlist();
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product");
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchWishlist]
  );

  const confirmDelete = useCallback(
    (productId) => {
      Alert.alert(
        "Delete product",
        "Are you sure you want to delete this product?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: () => deleteProduct(productId),
            style: "destructive",
          },
        ]
      );
    },
    [deleteProduct]
  );

  const renderWishlistItem = useCallback(
    ({ item }) => (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            style={styles.image}
            source={
              item.productId.images.length > 0
                ? { uri: item.productId.images[0] }
                : require("../../../assets/icon.png")
            }
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.productId.name}</Text>
            <Text style={styles.productPrice}>Rs. {item.productId.price}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleOpenModal(item.productId._id)}
            disabled={loading}
          >
            <Feather
              name="shopping-bag"
              size={24}
              color={PRIMARY_COLOR}
              style={styles.shoppingBagIcon}
            />
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="#95989A"
              style={styles.addIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => confirmDelete(item.productId._id)}
            disabled={loading}
          >
            <Feather
              name="trash-2"
              size={24}
              color="#FFB3A2"
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleOpenModal, confirmDelete, loading]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, modalVisible && styles.modalOpen]}>
        <Header navigation={navigation} />

        <View>
          <View style={styles.navigateIcon}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Wishlist</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <FlatList
            data={wishlist}
            keyExtractor={(item) => item._id}
            renderItem={renderWishlistItem}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>

      {modalVisible && (
        <View style={styles.modalContainer}>
          <ModalWishlist
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            productDetails={productDetails}
            navigation={navigation}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

WishList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default WishList;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  modalOpen: {
    opacity: 0.5,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 50,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 77,
    height: 85,
    borderRadius: 15,
    marginRight: 20,
  },
  productInfo: {
    width: 150,
    gap: 5,
  },
  productName: {
    fontSize: 17,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    alignItems: "center",
    justifyContent: "center",
  },
  shoppingBagIcon: {
    position: "relative",
  },
  addIcon: {
    position: "absolute",
    top: 5,
    bottom: 0,
    left: -7,
  },
  deleteIcon: {
    paddingVertical: 10,
  },
  navigateIcon: {
    alignItems: "center",
    justifyContent: "start",
    flexDirection: "row",
    marginBottom: 30,
  },
  modalContainer: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 30,
  },
});
