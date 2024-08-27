import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// biến đổi nền web sáng
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/theme-utils";
import { mode } from "@chakra-ui/theme-tools";
//////
import { BrowserRouter } from "react-router-dom";

import { RecoilRoot } from "recoil";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Định nghĩa các kiểu toàn cục cho ứng dụng
const styles = {
  global: (props) => ({
    body: {
      // Đặt màu chữ dựa trên chế độ màu hiện tại
      color: mode("gray.800", "whiteAlpha.900")(props),
      // Đặt màu nền dựa trên chế độ màu hiện tại
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};
// Định nghĩa cấu hình cho chủ đề Chakra UI
const config = {
  // Đặt chế độ màu ban đầu là "dark"
  initialColorMode: "light",
  // Bật tính năng chế độ màu của hệ thống
  useSystemColorMode: true,
};
// Định nghĩa các màu sắc tùy chỉnh cho bảng màu "gray"
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
        <ToastContainer />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
