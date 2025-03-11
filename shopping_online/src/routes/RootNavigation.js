import CheckList from "../components/design/CheckList";
import Completed from "../components/design/Completed";
import Details from "../components/design/Details";
import OrderDetailsScreen from "../components/design/OrderDetail";
import VNPayBank from "../components/design/payment/VnpayBank";
import VNPayOnline from "../components/design/payment/VnpayOnline";
import VNPayQR from "../components/design/payment/VnpayQR";
import PayOrder from "../components/design/PayOrder";
import AccountSetting from "../components/design/Setting/AccountSetting";
import ContactUs from "../components/design/Setting/ContactUs";
import OrderHistory from "../components/design/Setting/OrderHistory";
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
  {
    name: "VNPayQR",
    component: VNPayQR,
    options: { headerShown: false },
  },
  {
    name: "VNPayBank",
    component: VNPayBank,
    options: { headerShown: false },
  },
  {
    name: "VNPayOnline",
    component: VNPayOnline,
    options: { headerShown: false },
  },
  {
    name: "accountSetting",
    component: AccountSetting,
    options: { headerShown: false },
  },
  {
    name: "contactUs",
    component: ContactUs,
    options: { headerShown: false },
  },
  {
    name: "orderHistory",
    component: OrderHistory,
    options: { headerShown: false },
  },
];

export default screens;
