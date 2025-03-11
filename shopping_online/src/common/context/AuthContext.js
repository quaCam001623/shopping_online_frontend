import React, { createContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Import thư viện decode JWT
import { loginApi } from "../../services/loginService";
import { getAddressByUser } from "../../services/shippingAddressService";
import { getCards } from "../../services/cardService";
import { getUserById } from "../../services/userService";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [address, setAddress] = useState([]);
  const [cards, setCards] = useState([]);

  // When app is starting, check the token in AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("access_token");
        if (storedToken) {
          setToken(storedToken);
          const decodedToken = jwtDecode(storedToken);
          setUserId(decodedToken.userId);
        }
      } catch (error) {
        console.log("Error loading user data:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const fetch = async (userId) => {
      try {
        if (userId) {
          const responseAddress = await getAddressByUser(userId);
          if (responseAddress) {
            setAddress(responseAddress);
          }

          const responseUser = await getUserById(userId);
          if (responseUser) setUser(responseUser);

          const responseCard = await getCards(userId);
          if (responseCard) setCards(responseCard);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch(userId);
  }, [userId]);

  const login = async (email, password) => {
    try {
      const response = await loginApi({ email, password });

      if (response.data.access_token) {
        await AsyncStorage.setItem("access_token", response.data.access_token);
        setToken(response.data.access_token);
        // decode token
        const decodedToken = jwtDecode(response.data.access_token);
        setUserId(decodedToken.userId);

        console.log("Login successfull");
        return true;
      } else {
        console.log("Login Fail");
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      setUserId(null);
      setToken(null);
      return true;
    } catch (error) {
      console.log("Logout Failed!!!", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userId,
        setUserId,
        address,
        setAddress,
        cards,
        setCards,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
