import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";

import TabNavigator from "./src/routes/TabNavigation";
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
        <Toast />
        <TabNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
