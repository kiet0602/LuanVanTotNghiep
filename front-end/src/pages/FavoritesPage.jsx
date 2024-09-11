import React from "react";
import Layout from "../components/Layout";
import CartFavoritesProductsUser from "../components/CartFavoritesProductsUser";
import TitlleCustom from "../components/TitlleCustom";

const FavoritesPage = () => {
  return (
    <>
      <Layout>
        <CartFavoritesProductsUser />
      </Layout>
    </>
  );
};

export default FavoritesPage;
