import HomeScreen from "../components/design/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Categories from "../components/design/Categories";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PRIMARY_COLOR } from "../utils/enums";
import Profile from "../components/design/Profile";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarLabelStyle: { fontSize: 16, fontWeight: "bold" },
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: "grey",
        headerShown: false, // Ẩn Header của từng tab
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="home"
              size={24}
              color={focused ? PRIMARY_COLOR : "gray"}
            />
          ),
          tabBarStyle: { height: 60 },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Categories}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="search"
              size={24}
              color={focused ? PRIMARY_COLOR : "gray"}
            />
          ),
          tabBarStyle: { height: 60 },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="user"
              size={24}
              color={focused ? PRIMARY_COLOR : "gray"}
            />
          ),
          tabBarStyle: { height: 60 },
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
