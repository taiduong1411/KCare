import { createContext, useState, useEffect } from "react";
import { getItems } from "../services/custom.api";
import { jwtDecode } from "jwt-decode";

// Tạo Context
export const UserContext = createContext();

// Tạo Provider
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  var token = localStorage.getItem("accessToken");

  // Tách hàm getAccountInfo ra để tái sử dụng
  const getAccountInfo = async (userId) => {
    try {
      const res = await getItems(`/account/user-info/${userId}`);
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching user data", err);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        var tokenDecode = jwtDecode(token);
        setIsTokenValid(true);
        getAccountInfo(tokenDecode.id);
      } catch (error) {
        console.error("Invalid token", error);
        setIsTokenValid(false);
      }
    } else {
      setIsTokenValid(false);
    }
  }, [token]);

  const updateUserData = async () => {
    if (token) {
      try {
        const tokenDecode = jwtDecode(token);
        await getAccountInfo(tokenDecode.id);
      } catch (error) {
        console.error("Error updating user data", error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, isTokenValid }}>
      {children}
    </UserContext.Provider>
  );
};
