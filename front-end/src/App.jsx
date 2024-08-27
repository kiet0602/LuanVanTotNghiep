import React from "react";
import { Box } from "@chakra-ui/react";
import { Route, Routes, Navigate } from "react-router-dom";
import PageUser from "./pages/PageUser";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ButtonIconModeColor from "./components/ButtonIconModeColor";
import OAuthCallback from "./pages/OAuthCallback";

import { useRecoilValue } from "recoil";
import Test from "./pages/Test";
import LocationSelector from "./pages/LayTinhThanh";

function App() {
  return (
    <>
      {/* Set the position to fixed to keep the button in place on scroll */}
      <Box position={"fixed"} bottom={4} right={4} zIndex={9}>
        <ButtonIconModeColor />
      </Box>
      <Box position={"relative"} w={"full"}>
        <Routes>
          <Route path="/oauth/:token" element={<OAuthCallback />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/profileUser" element={<PageUser />} />
          <Route path="/checkOut" element={<CheckoutPage />} />
          <Route path="/productDetail" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* Route for Google Authentication */}
          <Route path="/test" element={<Test />} />
          <Route path="/tinhthanh" element={<LocationSelector />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
