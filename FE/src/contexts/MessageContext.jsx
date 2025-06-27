import React, { createContext, useContext } from "react";
import { message as antdMessage } from "antd";

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [messageApi, contextHolder] = antdMessage.useMessage();

  // Hàm showMessage sử dụng messageApi
  const showMessage = (type, content) => {
    messageApi.open({ type, content });
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};
