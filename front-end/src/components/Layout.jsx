import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
