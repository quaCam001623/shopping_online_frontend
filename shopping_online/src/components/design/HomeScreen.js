import React, { useEffect, useState } from "react";
import { Image, Text, View, ScrollView, TouchableOpacity } from "react-native";
import Header from "../common/Header";
import { SearchBar } from "react-native-elements";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { getProducts } from "../../services/productService";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response) {
          setProducts(response); // Lưu dữ liệu vào state
          setFilterProducts(response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  // console.log("products", products);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilterProducts(products);
    } else {
      const filtered = products.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilterProducts(filtered);
    }
  };

  console.log(" products", products);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Header navigation={navigation} />

        <Text style={styles.text}>Find the best fit for all your needs</Text>
        <SearchBar
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.search}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        <View style={{ height: 500 }}>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {products != null ? (
              filterProducts?.map((item) => (
                <TouchableOpacity
                  style={styles.item}
                  key={item._id}
                  onPress={() =>
                    navigation.navigate(`details`, { id: item._id })
                  }
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
              ))
            ) : (
              <View>
                <Text>Loading.....</Text>
              </View>
            )}
          </ScrollView>
        </View>
        {/* <Bottom /> */}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {},
  text: {
    fontWeight: "bold",
    fontSize: 24,
    height: 60,
    width: 225,
    marginVertical: 25,
    marginHorizontal: 30,
  },

  search: {
    width: 321,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#e8e8e8",
  },
  searchContainer: {
    borderTopColor: "transparent",
    backgroundColor: "transparent",
    alignSelf: "center",
    paddingBottom: 20,
    borderBottomColor: "transparent",
    borderColor: "transparent",
  },
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
