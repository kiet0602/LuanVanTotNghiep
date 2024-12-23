import React from "react";
import Layout from "../components/Layout";
import CartFavoritesProductsUser from "../components/CartFavoritesProductsUser";
import TitlleCustom from "../components/TitlleCustom";

const FavoritesPage = () => {
  return (
    <>
      <Layout>
        <TitlleCustom
          title={"Sản phẩm yêu thích của bạn"}
          description={"Những sản phẩm bạn đã thích ở cửa hàng chúng tôi"}
        />
        <CartFavoritesProductsUser />
      </Layout>
    </>
  );
};

export default FavoritesPage;
