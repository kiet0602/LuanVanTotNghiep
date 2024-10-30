import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Footter from "./Footter";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Navbar />
      <main>{children}</main>
      <Footter />
    </>
  );
};

export default Layout;
