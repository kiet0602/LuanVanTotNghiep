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

import EnterEmailPage from "./pages/EnterEmailPage";
import SubmitCodeOTPPage from "./pages/SubmitCodeOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import userAtom from "./Atom/userAtom";
import Table1111 from "./pages/Table.jsx";

function App() {
  const user = useRecoilValue(userAtom);
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
          <Route
            path="/signIn"
            element={!user ? <SignInPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signUp"
            element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/profileUser"
            element={user ? <PageUser /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/checkOut"
            element={user ? <CheckoutPage /> : <Navigate to={"/signIn"} />}
          />
          <Route path="/productDetail" element={<ProductDetailPage />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to={"/signIn"} />}
          />
          {/* Route for Google Authentication */}
          <Route path="/test" element={<Test />} />

          <Route
            path="/enterEmail"
            element={!user ? <EnterEmailPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/submitOTP"
            element={!user ? <SubmitCodeOTPPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/resetPassword"
            element={!user ? <ResetPasswordPage /> : <Navigate to={"/"} />}
          />
          <Route path="/table" element={<Table1111 />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
