import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["#24D5CB", "#0088FF", "#0A0A0A"];

const ProductDetailModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <Modal visible={!!product} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            ✖
          </TouchableOpacity>

          <Image source={product.image} style={styles.image} />

          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>Rs. {product.price}</Text>

          <Text style={styles.label}>Description:</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ullamcorper
            in non at egestas metus auctor ultrices.
          </Text>

          <Text style={styles.label}>Size:</Text>
          <View style={styles.sizeContainer}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[
                  styles.sizeBox,
                  selectedSize === size && styles.selectedSize,
                ]}
              >
                <Text>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Colors Available:</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addToCartButton}>
              <Text>Add To Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNowButton}>
              <Text>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    // opacity: 0.5,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 521,
  },
  closeButton: { alignSelf: "flex-end", fontSize: 20 },
  image: { width: 100, height: 100, alignSelf: "center", borderRadius: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  price: { fontSize: 18, color: "red", marginVertical: 5 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  description: { fontSize: 14, color: "gray", marginBottom: 10 },
  sizeContainer: { flexDirection: "row", marginBottom: 10 },
  sizeBox: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  selectedSize: { backgroundColor: "pink", borderColor: "red" },
  colorContainer: { flexDirection: "row", marginBottom: 10 },
  colorCircle: { width: 30, height: 30, borderRadius: 15, marginHorizontal: 5 },
  selectedColor: { borderWidth: 2, borderColor: "black" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  addToCartButton: {
    backgroundColor: "#FFD1DC",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  buyNowButton: {
    backgroundColor: "#FFB6C1",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
});

export default ProductDetailModal;
