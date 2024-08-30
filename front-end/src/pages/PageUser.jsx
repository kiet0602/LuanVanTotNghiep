import React from "react";
import Layout from "../components/Layout";
import { Box, Divider } from "@chakra-ui/react";
import ListOrderUser from "../components/ListOrderUser";
import Features from "../components/Features";
import CartinfoUser from "../components/CartinfoUser";

///
const PageUser = () => {
  return (
    <>
      <Layout>
        <CartinfoUser />
        <Divider />
        <ListOrderUser />
        <Divider />
        <Features />
        <Divider />
      </Layout>
    </>
  );
};

export default PageUser;
