import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { PRIMARY_COLOR } from "../../utils/enums";
import HeaderNav from "../common/HeaderNav";
import ButtonText from "../common/ButtonText";
import { CheckBox } from "react-native-elements";
import { getCards, updateCard } from "../../services/cardService";
import ConfirmRemove from "../../funtions/ConfirmRemove";
import { AuthContext } from "../../common/context/AuthContext";

const CheckList = () => {
  const route = useRoute();
  const { cardId } = route.params; // Nhận id từ params
  const { userId } = useContext(AuthContext);
  const [isSelected, setSelection] = useState([cardId]);
  const [cards, setCards] = useState([]);
  const actionSheetRef = useRef(null);
  const [selectedItemToRemove, setSelectedItemToRemove] = useState(null);

  // console.log("cardId", cardId);

  const confirmRemove = (item) => {
    setSelectedItemToRemove(item);
    actionSheetRef.current?.show();
  };

  useEffect(() => {
    const fetchCarts = async (userId) => {
      try {
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
      }
    };
    if (userId) {
      fetchCarts(userId);
    }
  }, [userId]);

  const handleChecbox = (item) => {
    setSelection((prev) =>
      prev.includes(item._id)
        ? prev.filter((id) => id !== item._id)
        : [...prev, item._id]
    );
  };

  const updateC = async (cardId, data) => {
    try {
      const response = await updateCard(cardId, data);

      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === cardId
            ? { ...card, quantity: response?.data.quantity }
            : card
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantity = (cardId, quantity) => {
    updateC(cardId, { quantity });
  };

  const totalAmount = cards
    .filter((item) => isSelected.includes(item._id))
    .reduce(
      (sum, item) => sum + item.productDetailId.productId.price * item.quantity,
      0
    );

  return (
    <View style={styles.container}>
      <HeaderNav screen="Shopping Bag" navigation={navigation} />
      <View style={{ height: 500, flexDirection: "column-reverse" }}>
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
                <View style={{ width: 150, gap: 5 }}>
                  <Text>{item?.productDetailId?.productId?.name}</Text>
                  <Text>
                    Rs.{" "}
                    {Number(
                      item?.productDetailId?.productId?.price
                    ).toLocaleString("vi-Vn")}
                  </Text>
                  <Text>Size: {item?.productDetailId?.size}</Text>

                  {/* quantity */}
                  <View style={styles.operationContainer}>
                    <TouchableOpacity
                      style={[
                        styles.operation,
                        item.quantity > 20 && styles.disabledButton,
                      ]}
                      onPress={() =>
                        handleQuantity(item._id, item.quantity + 1)
                      }
                      disabled={item.quantity > 20 ? true : false}
                    >
                      <Text style={styles.operationPlus}>+</Text>
                    </TouchableOpacity>
                    <Text>{item?.quantity}</Text>
                    <TouchableOpacity
                      style={[
                        styles.operation,
                        item.quantity > 20 && styles.disabledButton,
                      ]}
                      onPress={() =>
                        handleQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity == 1 ? true : false}
                    >
                      <Text style={styles.operationMinus}>-</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* size & delete */}
                <View>
                  <View
                    style={[
                      styles.sizeContainer,
                      { backgroundColor: item?.productDetailId?.color },
                    ]}
                  ></View>

                  <TouchableOpacity onPress={() => confirmRemove(item)}>
                    <Feather
                      name="trash-2"
                      size={24}
                      color={PRIMARY_COLOR}
                      style={styles.trashIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* remove */}
                <ConfirmRemove
                  actionSheetRef={actionSheetRef}
                  item={selectedItemToRemove ? selectedItemToRemove : item}
                  setCards={setCards}
                />
              </View>
            ))}
        </ScrollView>
      </View>

      {/* Action Sheet */}

      {/* <ActionSheet ref={actionSheetRef}>
        <View style={{ padding: 20 }}>
          <Button
            title="Cancel"
            onPress={() => actionSheetRef.current?.hide()}
          />
          <Button
            title="Remove"
            onPress={() => console.log("Remove product from cart")}
          />
        </View>
      </ActionSheet> */}

      {/* total money */}
      <View>
        <View style={styles.line}></View>
        <View style={styles.viewTotal}>
          <Text style={styles.text}>Sub Total</Text>
          <Text style={styles.number}>
            {totalAmount ? totalAmount.toLocaleString("vi-VN") + "VNĐ" : ""}
          </Text>
        </View>
        <View style={styles.viewTotal}>
          <Text style={styles.text}>Shipping</Text>
          <Text style={styles.number}>15.000 VNĐ</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.text}>Bag Total</Text>
          <Text style={styles.total}>
            {totalAmount
              ? (totalAmount + 15000).toLocaleString("vi-VN") + "VNĐ"
              : ""}
          </Text>
        </View>

        <ButtonText text="Proceed to Checkout" />
      </View>
    </View>
  );
};

export default CheckList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    backgroundColor: "white",
  },
  image: {
    width: 77,
    height: 85,
    borderRadius: 15,
    marginRight: 10,
  },
  viewTotal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
  number: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 20,
    marginBottom: 20,
  },
  total: {
    fontSize: 30,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: PRIMARY_COLOR,
  },
  operationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  operation: {
    width: 31,
    height: 30,
    borderRadius: 16,
    backgroundColor: "#e8e8e8",
    position: "relative",
  },
  operationPlus: {
    fontSize: 14,
    position: "absolute",
    top: 5,
    right: 11,
  },
  operationMinus: {
    fontSize: 15,
    position: "absolute",
    top: 3,
    right: 13,
  },
  sizeContainer: {
    width: 31,
    height: 30,
    borderRadius: 16,
    backgroundColor: "#24232B",
    position: "relative",
  },
  size: {
    color: "white",
    fontSize: 14,
    position: "absolute",
    top: 5,
    right: 11,
  },
  trashIcon: { paddingVertical: 10, marginLeft: 4 },
  line: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    width: 321,
    alignSelf: "center",
    paddingVertical: 20,
  },
  disabledButton: { opacity: 0.2 }, // Custom style khi disabled
});
