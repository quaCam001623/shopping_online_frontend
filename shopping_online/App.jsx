import React from "react";
import HomeScreen from "./src/components/design/HomeScreen";
import { View } from "react-native";
import Details from "./src/components/design/Details";
import HeaderNav from "./src/components/common/HeaderNav";
import CheckList from "./src/components/design/CheckList";
import PayOrder from "./src/components/design/PayOrder";

import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import Completed from "./src/components/design/Completed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import OrderDetail from "./src/components/design/OrderDetail";
import Categories from "./src/components/design/Categories";
import WishList from "./src/components/design/WishList";
import ModalWishlist from "./src/components/common/ModalWishlist";

import TabNavigator from "./src/routes/TabNavigation";
import LoginScreen from "./src/components/login/LoginScreen";
import Login from "./src/components/login/Login";
import Register from "./src/components/login/Register";
import Profile from "./src/components/design/Profile";
import AccountSetting from "./src/components/design/Setting/AccountSetting";
import ContactUs from "./src/components/design/Setting/ContactUs";
import OrderHistory from "./src/components/design/Setting/OrderHistory";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/common/context/AuthContext";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [loaded, error] = useFonts({
    quicksand: require("./assets/fonts/Quicksand/Quicksand-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <AuthProvider>
      <SafeAreaProvider>
        {/* <Toast /> */}
        {/* <HomeScreen /> */}
        {/* <Details /> */}
        {/* <HeaderNav screen="Home" /> */}
        {/* <CheckList /> */}
        {/* <PayOrder /> */}
        {/* <Completed /> */}
        <OrderDetail />
        {/* <Categories /> */}
        {/* <WishList /> */}

        {/* <LoginScreen /> */}
        {/* <Login /> */}
        {/* <Register /> */}
        {/* <Profile /> */}
        {/* <AccountSetting /> */}
        {/* <ContactUs /> */}
        {/* <OrderHistory /> */}
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
