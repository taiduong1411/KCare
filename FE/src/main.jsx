import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { NotificationProvider } from "./contexts/NotificationContext";
import { MessageProvider } from "./contexts/MessageContext";
import { UserProvider } from "./contexts/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <MessageProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </MessageProvider>
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
);
