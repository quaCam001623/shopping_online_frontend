import Chat from "../components/design/Chat";
import ChatScreen from "../components/design/ChatMessage";
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
import WishList from "../components/design/WishList";
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
    name: "wishlist",
    component: WishList,
    options: { headerShown: false },
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
    name: "vnpay_qr",
    component: VNPayQR,
    options: { headerShown: false },
  },
  {
    name: "vnpay_bank",
    component: VNPayBank,
    options: { headerShown: false },
  },
  {
    name: "vnpay_online",
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
  {
    name: "chat",
    component: Chat,
    options: { headerShown: false },
  },
  {
    name: "chatMessage",
    component: ChatScreen,
    options: { headerShown: true, title: "Customer Support" },
  },
];

export default screens;
