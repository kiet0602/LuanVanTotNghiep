import React from "react";
import ItemCart from "../components/ItemCart";
import Layout from "../components/Layout";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const CartPage = () => {
  return (
    <Layout>
      <Box bg={useColorModeValue("green.100", "gray.800")}>
        {" "}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="2xl" fontWeight="bold" mt={10}>
            Giỏ hàng của bạn
          </Text>
          <ItemCart />
        </Box>
      </Box>
    </Layout>
  );
};

export default CartPage;
