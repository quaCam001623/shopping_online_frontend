import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import { useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { PRIMARY_COLOR } from "../../utils/enums";
import HeaderNav from "../common/HeaderNav";
import ButtonText from "../common/ButtonText";
import { CheckBox } from "react-native-elements";
import { getCards, updateCard } from "../../services/cardService";
import ConfirmRemove from "../../funtions/ConfirmRemove";
import { AuthContext } from "../../common/context/AuthContext";
import ShowMessage from "../../funtions/Message";

const MAX_QUANTITY = 20;
const MIN_QUANTITY = 1;
const SHIPPING_FEE = 15000;

const CheckList = ({ navigation }) => {
  const route = useRoute();
  const { cardId = null } = route.params || {};
  const { userId } = useContext(AuthContext);
  const [isSelected, setSelection] = useState(cardId ? [cardId] : []);
  const [cards, setCards] = useState([]);
  const actionSheetRef = useRef(null);
  const [selectedItemToRemove, setSelectedItemToRemove] = useState(null);
  const [selectedProduct, setSelectedProdcut] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const confirmRemove = useCallback((item) => {
    setSelectedItemToRemove(item);
    actionSheetRef.current?.show();
  }, []);

  useEffect(() => {
    const fetchCarts = async (userId) => {
      try {
        setIsLoading(true);
        const response = await getCards(userId);

        if (response) {
          const selectedIds = isSelected ?? [];
          const sortCards = response.sort(
            (a, b) => selectedIds.includes(b._id) - selectedIds.includes(a._id)
          );
          setCards(sortCards);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
        ShowMessage("error", "Error", "Failed to fetch cart items");
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      fetchCarts(userId);
    }
  }, [userId, isSelected]);

  useEffect(() => {
    const selectedCards = cards
      .filter((card) => isSelected.includes(card._id))
      .map((card) => ({
        productDetailId: card.productDetailId._id,
        discountId: null,
        quantity: card.quantity,
        price: card.productDetailId.productId.price,
      }));
    setSelectedProdcut(selectedCards);
  }, [isSelected, cards]);

  const handleChecbox = useCallback((item) => {
    setSelection((prev) =>
      prev.includes(item._id)
        ? prev.filter((id) => id !== item._id)
        : [...prev, item._id]
    );
  }, []);

  const updateCardQuantity = useCallback(async (cardId, data) => {
    try {
      const response = await updateCard(cardId, data);
      if (response?.data) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card._id === cardId
              ? { ...card, quantity: response.data.quantity }
              : card
          )
        );
      }
    } catch (error) {
      console.error("Error updating card quantity:", error);
      ShowMessage("error", "Error", "Failed to update quantity");
    }
  }, []);

  const handleQuantity = useCallback(
    (cardId, newQuantity) => {
      if (newQuantity < MIN_QUANTITY || newQuantity > MAX_QUANTITY) {
        return;
      }
      updateCardQuantity(cardId, { quantity: newQuantity });
    },
    [updateCardQuantity]
  );

  const totalAmount = useMemo(
    () =>
      cards
        .filter((item) => isSelected.includes(item._id))
        .reduce(
          (sum, item) =>
            sum + item.productDetailId.productId.price * item.quantity,
          0
        ),
    [cards, isSelected]
  );

  const handlePayOrder = useCallback(() => {
    if (totalAmount < 1) {
      ShowMessage("error", "Error", "You have to choose at least a product");
      return;
    }
    navigation.navigate("payorder", {
      totalAmount: totalAmount + SHIPPING_FEE,
      selectedProduct,
      isSelected,
    });
  }, [totalAmount, selectedProduct, isSelected, navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        <ScrollView>
          {cards &&
            cards.map((item) => (
              <View key={item._id} style={styles.card}>
                <CheckBox
                  checked={isSelected.includes(item._id)}
                  onPress={() => handleChecbox(item)}
                  style={styles.checkbox}
                />

                <Image
                  style={styles.image}
                  source={
                    item?.productDetailId?.productId?.images
                      ? { uri: item.productDetailId.productId.images[0] }
                      : require("../../../assets/icon.png")
                  }
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {item?.productDetailId?.productId?.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    Rs.{" "}
                    {Number(
                      item?.productDetailId?.productId?.price
                    ).toLocaleString("vi-Vn")}
                  </Text>
                  <Text style={styles.productSize}>
                    Size: {item?.productDetailId?.size}
                  </Text>

                  <View style={styles.operationContainer}>
                    <TouchableOpacity
                      style={[
                        styles.operation,
                        item.quantity >= MAX_QUANTITY && styles.disabledButton,
                      ]}
                      onPress={() =>
                        handleQuantity(item._id, item.quantity + 1)
                      }
                      disabled={item.quantity >= MAX_QUANTITY}
                    >
                      <Text style={styles.operationPlus}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item?.quantity}</Text>
                    <TouchableOpacity
                      style={[
                        styles.operation,
                        item.quantity <= MIN_QUANTITY && styles.disabledButton,
                      ]}
                      onPress={() =>
                        handleQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= MIN_QUANTITY}
                    >
                      <Text style={styles.operationMinus}>-</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.actionContainer}>
                  <View
                    style={[
                      styles.sizeContainer,
                      { backgroundColor: item?.productDetailId?.color },
                    ]}
                  />

                  <TouchableOpacity onPress={() => confirmRemove(item)}>
                    <Feather
                      name="trash-2"
                      size={24}
                      color={PRIMARY_COLOR}
                      style={styles.trashIcon}
                    />
                  </TouchableOpacity>
                </View>

                <ConfirmRemove
                  actionSheetRef={actionSheetRef}
                  item={selectedItemToRemove || item}
                  setCards={setCards}
                  handleQuantity={handleQuantity}
                />
              </View>
            ))}
        </ScrollView>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.line} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub Total</Text>
          <Text style={styles.summaryValue}>
            {totalAmount ? totalAmount.toLocaleString("vi-VN") + "VNĐ" : ""}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>15.000 VNĐ</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Bag Total</Text>
          <Text style={styles.totalValue}>
            {totalAmount
              ? (totalAmount + SHIPPING_FEE).toLocaleString("vi-VN") + "VNĐ"
              : ""}
          </Text>
        </View>
        <TouchableOpacity onPress={handlePayOrder}>
          <ButtonText text="Proceed to Checkout" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

CheckList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default CheckList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    height: 500,
    flexDirection: "column-reverse",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  checkbox: {
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    width: 150,
    gap: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 14,
    color: PRIMARY_COLOR,
  },
  productSize: {
    fontSize: 14,
    color: "#666",
  },
  operationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  operation: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  operationPlus: {
    fontSize: 18,
    color: PRIMARY_COLOR,
  },
  operationMinus: {
    fontSize: 18,
    color: PRIMARY_COLOR,
  },
  quantityText: {
    fontSize: 16,
    minWidth: 30,
    textAlign: "center",
  },
  actionContainer: {
    marginLeft: "auto",
  },
  sizeContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  trashIcon: {
    marginTop: 5,
  },
  summaryContainer: {
    paddingVertical: 20,
  },
  line: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
});
