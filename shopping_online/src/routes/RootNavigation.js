import CheckList from "../components/design/CheckList";
import Details from "../components/design/Details";
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
    options: { headerShown: false },
  },
];

export default screens;
