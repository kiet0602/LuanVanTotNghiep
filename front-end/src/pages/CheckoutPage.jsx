import React from "react";
import Layout from "../components/Layout";
import InfoCartCheckout from "../components/InfoCartCheckout";
import InfoUserCheckout from "../components/InfoUserCheckout";
import { Container, Flex } from "@chakra-ui/react";

const CheckoutPage = () => {
  return (
    <>
      <Layout>
        <div>
          {" "}
          <Container maxW="container.xl">
            <Flex
              h={{ base: "auto", md: "100vh" }}
              py={[0, 10, 20]}
              direction={{
                base: "column-reverse",
                md: "row",
              }}
            >
              <InfoUserCheckout />
              <InfoCartCheckout />
            </Flex>
          </Container>
        </div>
      </Layout>
    </>
  );
};

export default CheckoutPage;
