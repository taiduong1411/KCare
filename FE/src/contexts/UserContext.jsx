import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItems } from "../services/custom.api";
import { jwtDecode } from "jwt-decode";

// Tạo Context
export const UserContext = createContext();

// Tạo Provider
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Lưu ý: UserProvider phải được wrap trong Router để useNavigate hoạt động
  const navigate = useNavigate();

  var token = localStorage.getItem("accessToken");

  // Helper function để kiểm tra token hết hạn
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch {
      return true; // Nếu decode lỗi thì coi như hết hạn
    }
  };

  // Helper function để clear token và redirect
  const handleTokenExpiry = () => {
    localStorage.removeItem("accessToken");
    setUserData(null);
    setIsTokenValid(false);
    navigate("/login");
  };

  // Tách hàm getAccountInfo ra để tái sử dụng
  const getAccountInfo = async (userId) => {
    try {
      const res = await getItems(`/account/user-info/${userId}`);
      setUserData(res.data);
    } catch (err) {
      console.error("Error fetching user data", err);
      // Nếu API trả về lỗi 401 (Unauthorized) thì có thể token hết hạn
      if (err.response?.status === 401) {
        handleTokenExpiry();
      }
    }
  };

  useEffect(() => {
    if (token) {
      try {
        // Kiểm tra token hết hạn trước khi sử dụng
        if (isTokenExpired(token)) {
          console.log("Token đã hết hạn, chuyển về trang login");
          handleTokenExpiry();
          return;
        }

        var tokenDecode = jwtDecode(token);
        setIsTokenValid(true);
        console.log("Token hợp lệ", tokenDecode);
        getAccountInfo(tokenDecode.id);
      } catch (error) {
        console.error("Invalid token", error);
        handleTokenExpiry();
      }
    } else {
      setIsTokenValid(false);
    }
  }, [token]);

  const updateUserData = async () => {
    if (token) {
      try {
        // Kiểm tra token hết hạn trước khi update
        if (isTokenExpired(token)) {
          handleTokenExpiry();
          return;
        }

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
