import React from "react";
import Hero from "../components/Hero";

import Features from "../components/Features";
import { Divider } from "@chakra-ui/react";

import Layout from "../components/Layout";
import LineReviewShop from "../components/LineReviewShop";
import CartProductsDiscount from "../components/CartProductsDiscount";
import IntroduceShop from "../components/IntroduceShop";

///
const HomePage = () => {
  return (
    <>
      <Layout>
        <Hero />
        <LineReviewShop />
        <CartProductsDiscount />
        <IntroduceShop />
        <Features />
      </Layout>
    </>
  );
};

export default HomePage;
