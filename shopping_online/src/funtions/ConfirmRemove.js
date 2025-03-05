import React, { useRef } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { globalStyles, PRIMARY_COLOR } from "../utils/enums";
import { deleteCard } from "../services/cardService";
import ShowMessage from "./Message";

const ConfirmRemove = ({ actionSheetRef, item, setCards }) => {
  console.log("item remove", item);
  const deleteC = async (cardId) => {
    try {
      await deleteCard(cardId);
      console.log("delete card");
      ShowMessage(
        "success",
        "Successfully",
        "Remove product from the cart successfully"
      );
      // onDeleteSuccess(cardId);
      setCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      {/* Action Sheet */}
      <ActionSheet ref={actionSheetRef}>
        <View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              margin: 20,
              alignItems: "center",
              //   justifyContent: "space-between",
            }}
          >
            <Image
              style={styles.image}
              source={
                item?.productDetailId?.productId?.images
                  ? { uri: item.productDetailId.productId.images[0] }
                  : require("../../assets/icon.png")
              }
            />

            {/* Detail Product */}
            <View>
              <View>
                <Text style={styles.name}>
                  {item?.productDetailId?.productId?.name}
                </Text>
                <Text style={styles.size}>
                  Size: {item?.productDetailId?.size}
                </Text>
                <Text style={[globalStyles.price]}>
                  {" "}
                  Rs.{" "}
                  {Number(
                    item?.productDetailId?.productId?.price
                  ).toLocaleString("vi-Vn")}
                </Text>
              </View>

              {/* quantity */}
              <View style={styles.operationContainer}>
                <TouchableOpacity
                  style={[
                    styles.operation,
                    item.quantity > 20 && styles.disabledButton,
                  ]}
                  onPress={() => handleQuantity(item._id, item.quantity + 1)}
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
                  onPress={() => handleQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity == 1 ? true : false}
                >
                  <Text style={styles.operationMinus}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Button */}
          <View style={styles.buttonBox}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => actionSheetRef.current?.hide()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log("Remove product from cart");
                deleteC(item._id);
                actionSheetRef.current?.hide();
              }}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
    </View>
  );
};

export default ConfirmRemove;

const styles = StyleSheet.create({
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
  disabledButton: { opacity: 0.2 }, // Custom style khi disabled
  operationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 5,
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
  buttonBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    marginVertical: 20,
    // marginBottom: 50,
  },
  button: {
    width: 134,
    height: 50,
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
  size: {
    fontWeight: "400",
    fontSize: 14,
    color: "gray",
  },
});
