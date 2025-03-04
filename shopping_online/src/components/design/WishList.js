import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Header from "../common/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { product } from "../../utils/data";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PRIMARY_COLOR } from "../../utils/enums";

import Bottom from "../common/Bottom";
import ModalWishlist from "../common/ModalWishlist";
import HeaderNav from "../common/HeaderNav";

const WishList = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpentModal = () => {
    setModalVisible(true);
    console.log("open modal");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[styles.container, modalVisible == true && styles.modalOpen]}
        // style={styles.container}
      >
        <Header />
        {/* Header navigate */}

        {/* product List */}
        <View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "start",
              flexDirection: "row",
              marginBottom: 30,
            }}
          >
            <TouchableOpacity
              // onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            {/* Tiêu đề */}
            <Text style={styles.title}>Wishlist</Text>
          </View>
          <View style={{ height: 600 }}>
            <FlatList
              data={product}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image style={styles.image} source={item.img} />
                    <View style={{ width: 150, gap: 5 }}>
                      <Text style={{ fontSize: 17, fontWeight: "500" }}>
                        {item.name}
                      </Text>
                      <Text>Rs. {item.price}</Text>
                    </View>
                  </View>

                  {/* size & delete */}
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <TouchableOpacity onPress={() => handleOpentModal()}>
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
                    <Feather
                      name="trash-2"
                      size={24}
                      color="#FFB3A2"
                      style={{ paddingVertical: 10 }}
                    />
                  </View>
                </View>
              )}
            />
          </View>
        </View>

        {/* Bottom */}
        <Bottom />
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
    margin: 20,
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
});
