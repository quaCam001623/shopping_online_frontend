import React, { createContext, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SERVER_URL } from "../../services/baseService";
import { loginApi } from "../../services/loginService";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();

  const login = async (email, password) => {
    try {
      const response = await loginApi({ email, password });

      if (response.access_token) {
        await AsyncStorage.setItem("access_token", response.access_token);
        setToken(response.access_token);
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
      return true;
    } catch (error) {
      console.log("Logout Failed!!!", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
