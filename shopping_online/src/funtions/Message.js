import Toast from "react-native-toast-message";

const ShowMessage = (type, title, message) => {
  Toast.show({
    type: type,
    text1: title,
    text2: message,
    position: "top",
    autoHide: true,
    topOffset: 50,
  });
};

export default ShowMessage;
