import React from "react";
import Hero from "../components/Hero";

import Features from "../components/Features";
import { Divider } from "@chakra-ui/react";

import Cards from "../components/Cards";
import Layout from "../components/Layout";
///
const HomePage = () => {
  return (
    <>
      <Layout>
        <Hero />
        <Cards />
        <Divider mx="auto" maxWidth={"6xl"} />
        <Cards />
        <Divider mx="auto" maxWidth={"6xl"} />
        <Features />
      </Layout>
    </>
  );
};

export default HomePage;
