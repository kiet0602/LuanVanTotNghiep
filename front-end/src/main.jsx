import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Biến đổi nền web sáng
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/theme-utils";
import { mode } from "@chakra-ui/theme-tools";

import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import font chữ tùy chỉnh

// Import các font chữ đã cài đặt
import "@fontsource/quicksand"; // Cài đặt font chữ Quicksand
import "@fontsource/allura"; // Cài đặt font chữ Allura
import "@fontsource/playfair-display"; // Cài đặt font chữ Playfair Display

// Định nghĩa các kiểu toàn cục cho ứng dụng
const styles = {
  global: (props) => ({
    body: {
      color: mode("black", "white")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};

// Định nghĩa cấu hình cho chủ đề Chakra UI
const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

// Định nghĩa các màu sắc tùy chỉnh cho bảng màu "gray"
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

// Thêm font chữ vào theme
const fonts = {
  heading: "'Playfair Display', serif", // Font chữ cho tiêu đề
  body: "'Quicksand', sans-serif", // Font chữ cho nội dung
  accent: "'Allura', cursive", // Font chữ cho các phần nhấn mạnh
};

const theme = extendTheme({ config, styles, colors, fonts });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
        <ToastContainer
          autoClose={1000}
          position="bottom-center"
          hideProgressBar={true}
          style={{ width: "270px", fontSize: "12px" }}
        />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
