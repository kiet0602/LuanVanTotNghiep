import React from "react";
import Layout from "../components/Layout";
import CartFavoritesProductsUser from "../components/CartFavoritesProductsUser";
import TitlleCustom from "../components/TitlleCustom";

const FavoritesPage = () => {
  return (
    <>
      <Layout>
        <TitlleCustom title={"Sản phẩm yêu thích của bạn"} />
        <CartFavoritesProductsUser />
      </Layout>
    </>
  );
};

export default FavoritesPage;
