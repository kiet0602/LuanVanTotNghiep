import React from "react";
import Layout from "../components/Layout";
import CardInfoUser from "../components/CardInfoUser";
import { Divider } from "@chakra-ui/react";
import ListOrderUser from "../components/ListOrderUser";
import Features from "../components/Features";
///
const PageUser = () => {
  return (
    <>
      <Layout>
        <CardInfoUser />
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
