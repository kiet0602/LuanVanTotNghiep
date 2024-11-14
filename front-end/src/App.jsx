import React from "react";
import { Box } from "@chakra-ui/react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
//Atom
import userTokenAtom from "./Atom/userAtom";
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
import DiscountProductsPage from "./pages/DiscountProductsPage.jsx";
import ReturnShipingPage from "./pages/ReturnShipingPage.jsx";

function App() {
  const token = useRecoilValue(userTokenAtom);
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
            element={token ? <PageUser /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/checkOut"
            element={token ? <CheckoutPage /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/signIn"
            element={!token ? <SignInPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signUp"
            element={!token ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/cart"
            element={token ? <CartPage /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/favirotesProduct"
            element={token ? <FavoritesPage /> : <Navigate to={"/signIn"} />}
          />
          <Route
            path="/success"
            element={token ? <SuccessOrderPage /> : <Navigate to={"/"} />}
          />
          {/* -------------------------------- Not User ---------------------------------------------- */}
          <Route
            path="/products/:productName"
            element={<ProductDetailPage />}
          />
          <Route
            path="/enterEmail"
            element={!token ? <EnterEmailPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/submitOTP"
            element={!token ? <SubmitCodeOTPPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/resetPassword"
            element={!token ? <ResetPasswordPage /> : <Navigate to={"/"} />}
          />
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/DiscountProducts" element={<DiscountProductsPage />} />
          <Route path="/returnShiping" element={<ReturnShipingPage />} />

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
