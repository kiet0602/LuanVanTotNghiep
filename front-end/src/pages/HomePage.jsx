import React from "react";
import Hero from "../components/Hero";

import Features from "../components/Features";
import { Divider } from "@chakra-ui/react";

import Layout from "../components/Layout";

///
const HomePage = () => {
  return (
    <>
      <Layout>
        <Hero />
        <Divider mx="auto" maxWidth={"6xl"} />
        <Divider mx="auto" maxWidth={"6xl"} />
        <Features />
      </Layout>
    </>
  );
};

export default HomePage;
