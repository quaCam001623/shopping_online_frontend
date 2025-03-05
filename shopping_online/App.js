import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ThumnailScreen from "./src/components/design/ThumnailScreen";
import HomeScreen from "./src/components/design/HomeScreen";
import WishList from "./src/components/design/WishList";
import TabNavigator from "./src/routes/TabNavigation";
import Login from "./src/components/login/Login";
import { AuthProvider } from "./src/common/context/AuthContext";
import Register from "./src/components/login/Register";
import screens from "./src/routes/RootNavigation";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="thumnail">
      {screens.map(({ name, component, options }) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStack />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}
