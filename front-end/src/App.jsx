import React from "react";
import { Box } from "@chakra-ui/react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
//Atom
import userAtom from "./Atom/userAtom";
//components
import ButtonIconModeColor from "./components/ButtonIconModeColor";
//pages
import PageUser from "./pages/PageUser";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
// import OAuthCallback from "./pages/OAuthCallback";
// import Test from "./pages/Test";
import EnterEmailPage from "./pages/EnterEmailPage";
import SubmitCodeOTPPage from "./pages/SubmitCodeOTPPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NewsPage from "./pages/NewsPage.jsx";
import ProductsCategoryPage from "./pages/ProductsCategoryPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import NotPage from "./pages/NotPage.jsx";
import SuccessOrderPage from "./pages/SuccessOrderPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <>
      {/* Set the position to fixed to keep the button in place on scroll */}
      <Box position={"fixed"} bottom={4} left={4} zIndex={9} ml={"20px"}>
        <ButtonIconModeColor />
      </Box>
      <Box position={"relative"} w={"full"}>
        <Routes>
          {/*------------------------------------------ User page----------------------------------- */}
          <Route
            path="/profileUser"
            element={user ? <PageUser /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/checkOut"
            element={user ? <CheckoutPage /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/signIn"
            element={!user ? <SignInPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signUp"
            element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/favirotesProduct"
            element={user ? <FavoritesPage /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/success"
            element={user ? <SuccessOrderPage /> : <Navigate to={"/"} />}
          />
          {/* -------------------------------- Not User ---------------------------------------------- */}
          <Route
            path="/products/:productName"
            element={<ProductDetailPage />}
          />
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
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/category/:categoryId"
            element={<ProductsCategoryPage />}
          />
          {/* --------------------------- link not of ------------------------------------------ */}
          <Route path="*" element={<NotPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
