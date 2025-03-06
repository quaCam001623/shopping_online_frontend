import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { PRIMARY_COLOR } from "../../utils/enums";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const Categories = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      const filterCategory = products.filter(
        (item) => item.category === selectedCategory
      );
      setFilterProducts(filterCategory);
    } else {
      setFilterProducts(products); // Nếu không có danh mục nào được chọn, hiển thị tất cả
    }
  }, [selectedCategory, products]); // Chạy lại khi selectedCategory hoặc products thay đổi

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        const dataCategory = await getCategories();
        if (response) {
          setProducts(response); // Lưu dữ liệu vào state
          setFilterProducts(response);
        }
        if (dataCategory) {
          setCategories(dataCategory);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // console.log("category", categories);

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

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.wrapper}>
          {/* search & avatar */}
          <View styls={styles.header}>
            <SearchBar
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.search}
              placeholder="Search for products"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <Image
              style={styles.avatar}
              source={require("../../../assets/avatar.jpg")}
            />
          </View>

          {/* categories */}
          <View style={{ marginLeft: 30 }}>
            <Text style={styles.categoriesText}>Categories</Text>
            <View style={styles.iconText}>
              {/* pants */}
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setSelectedCategory("jeans")}
              >
                <View
                  style={
                    selectedCategory == "jeans" ? styles.iconBox : styles.icon
                  }
                >
                  <MaterialCommunityIcons
                    name="human"
                    size={24}
                    color={selectedCategory == "jeans" ? "white" : "black"}
                  />
                </View>
                <Text>Pants</Text>
              </TouchableOpacity>

              {/* shirt */}
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setSelectedCategory("shirt")}
              >
                <View
                  style={
                    selectedCategory == "shirt" ? styles.iconBox : styles.icon
                  }
                >
                  <Ionicons
                    name="shirt-outline"
                    size={24}
                    color={selectedCategory == "shirt" ? "white" : "black"}
                  />
                </View>
                <Text>Shirt</Text>
              </TouchableOpacity>

              {/* pants */}
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setSelectedCategory("dress")}
              >
                <View
                  style={
                    selectedCategory == "dress" ? styles.iconBox : styles.icon
                  }
                >
                  <FontAwesome6
                    name="person-dress"
                    size={24}
                    color={selectedCategory == "dress" ? "white" : "black"}
                  />
                </View>
                <Text>Dress</Text>
              </TouchableOpacity>

              {/* Coat */}
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setSelectedCategory("coat")}
              >
                <View
                  style={
                    selectedCategory == "coat" ? styles.iconBox : styles.icon
                  }
                >
                  <MaterialCommunityIcons
                    name="shoe-print"
                    size={24}
                    color={selectedCategory == "coat" ? "white" : "black"}
                  />
                </View>
                <Text>Coat</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* product list */}
          <View style={{ height: 600, marginTop: 20, marginBottom: "20px" }}>
            <ScrollView contentContainerStyle={styles.productsContainer}>
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
        </View>
        {/* <Bottom /> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Đảm bảo không có màu nền tràn
  },
  wrapper: {
    flex: 1,
    marginTop: 50,
  },
  search: {
    height: 50,
    borderRadius: 15,
    backgroundColor: "white",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderBlockColor: "white",
    alignSelf: "center",
    width: "90%", // Đảm bảo nó co giãn theo màn hình
    height: 60, // Đủ chiều cao để không bị lỗi
    position: "relative",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    position: "absolute",
    right: 20,
    top: 10,
  },
  image: {
    width: 151,
    height: 199,
    borderRadius: 10,
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
  categoriesText: {
    fontWeight: "600",
    fontSize: 22,
    marginVertical: 10,

    marginVertical: 20,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fae9ef",
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  iconBox: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_COLOR,
    textAlign: "center",
  },
  iconText: {
    flexDirection: "row",
    gap: 15,
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  iconContainer: {
    flexDirection: "column",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
