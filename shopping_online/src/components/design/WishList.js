import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
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
  const { userId } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await getProductById(productId);
      if (response) setProductDetails(response);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchWishlist = async () => {
    const response = await getWishlistByUser(userId);
    if (response) setWishlist(response);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  console.log("productDetails", productDetails);

  const handleOpentModal = (productId) => {
    setModalVisible(true);
    fetchProductDetails(productId);
  };

  const deleteProduct = async (productId) => {
    await deleteWishlist(userId, productId);
    fetchWishlist();
  };

  const confirmDelete = (productId) => {
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
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[styles.container, modalVisible == true && styles.modalOpen]}
        // style={styles.container}
      >
        <Header navigation={navigation} />
        {/* Header navigate */}

        {/* product List */}
        <View>
          <View style={styles.navigateIcon}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            {/* Tiêu đề */}
            <Text style={styles.title}>Wishlist</Text>
          </View>

          <View>
            <FlatList
              data={wishlist}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={styles.image}
                      // source={item.productId.images[0]}
                      source={
                        item.productId.images.length > 0
                          ? { uri: item.productId.images[0] }
                          : require("../../../assets/icon.png")
                      }
                    />
                    <View style={{ width: 150, gap: 5 }}>
                      <Text style={{ fontSize: 17, fontWeight: "500" }}>
                        {item.productId.name}
                      </Text>
                      <Text>Rs. {item.productId.price}</Text>
                    </View>
                  </View>

                  {/* size & delete */}
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <TouchableOpacity
                      onPress={() => handleOpentModal(item.productId._id)}
                    >
                      <Feather
                        name="shopping-bag"
                        size={24}
                        color={PRIMARY_COLOR}
                        style={{ position: "relative" }}
                      />

                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="#95989A"
                        style={{
                          position: "absolute",
                          top: 5,
                          bottom: 0,
                          left: -7,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => confirmDelete(item.productId._id)}
                    >
                      <Feather
                        name="trash-2"
                        size={24}
                        color="#FFB3A2"
                        style={{ paddingVertical: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>

        {/* Bottom */}
        {/* <Bottom /> */}
      </View>

      {/* Modal */}
      {modalVisible && (
        <View
          styles={{
            backgroundColor: "white",
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            top: 30,
          }}
        >
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

export default WishList;

const styles = StyleSheet.create({
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  iconBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: PRIMARY_COLOR,
  },
  image: {
    width: 77,
    height: 85,
    borderRadius: 15,
    marginRight: 20,
  },
  navigateIcon: {
    alignItems: "center",
    justifyContent: "start",
    flexDirection: "row",
    marginBottom: 30,
  },
});
