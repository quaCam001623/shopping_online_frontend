import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PRIMARY_COLOR } from "../../utils/enums";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ThumnailScreen = ({ navigation }) => {
  const handleStart = () => {
    navigation.navigate("Main");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../../assets/coat.png")}
          />
          <View style={{ gap: 5, marginHorizontal: 20, marginVertical: 30 }}>
            <Text style={styles.enjoin}>Enjoin Your Online</Text>
            <Text style={styles.enjoin}>Shopping</Text>
            <Text style={styles.browser}>
              Browse through all categories and shop the best clothes for your
              dream.
            </Text>
          </View>
          <View style={styles.getStart}>
            <TouchableOpacity onPress={handleStart}>
              <Text style={styles.getText}>Get started</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ThumnailScreen;

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 600,
    width: "100%",
    objectFit: "cover",
  },

  enjoin: {
    color: PRIMARY_COLOR,
    fontWeight: "medium",
    fontSize: 20,
  },
  browser: {
    fontSize: 12,
    fontWeight: "medium",
    color: "black",
  },
  getStart: {
    width: 222,
    height: 41,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    marginHorizontal: "auto",
    marginTop: 10,
  },
  getText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginTop: 9,
  },
  line: {
    width: 135,
    height: 3,
    backgroundColor: "#D9D9D9",
    marginHorizontal: "auto",
    marginVertical: 10,
  },
});
