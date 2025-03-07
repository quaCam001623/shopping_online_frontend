import CheckList from "../components/design/CheckList";
import Completed from "../components/design/Completed";
import Details from "../components/design/Details";
import OrderDetailsScreen from "../components/design/OrderDetail";
import PayOrder from "../components/design/PayOrder";
import ThumnailScreen from "../components/design/ThumnailScreen";
import Login from "../components/login/Login";
import Register from "../components/login/Register";
import TabNavigator from "./TabNavigation";

const screens = [
  {
    name: "thumnail",
    component: ThumnailScreen,
    options: { headerShown: false },
  },
  { name: "login", component: Login, options: { headerShown: false } },
  {
    name: "register",
    component: Register,
    options: { headerShown: false },
  },
  {
    name: "Main",
    component: TabNavigator,
    options: { headerShown: false },
  },
  {
    name: "details",
    component: Details,
    options: {
      headerShown: false,
    },
  },
  {
    name: "checklist",
    component: CheckList,
    options: { headerShown: true, title: "Shopping Bag" },
  },
  {
    name: "payorder",
    component: PayOrder,
    options: { headerShown: true, title: "Checkout" },
  },
  {
    name: "complete",
    component: Completed,
    options: { headerShown: false },
  },
  {
    name: "orderdetail",
    component: OrderDetailsScreen,
    options: { headerShown: true, title: "Order Details" },
  },
];

export default screens;
