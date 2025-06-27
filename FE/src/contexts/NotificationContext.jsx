import React, { createContext, useContext } from "react";
import { notification as antdNotification } from "antd";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notificationApi, contextHolder] = antdNotification.useNotification();

  // Hàm showMessage sử dụng messageApi
  const showNotification = (type, content = {}) => {
    notificationApi.open({
      type,
      message: content,
      showProgress: true,
      pauseOnHover: true,
      duration: 1.5,
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
