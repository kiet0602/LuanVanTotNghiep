import React from "react";
import ItemCart from "../components/ItemCart";
import Layout from "../components/Layout";
import { Box, Text } from "@chakra-ui/react";

const CartPage = () => {
  return (
    <Layout>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={10} // Adding spacing from the top
      >
        <Text fontSize="2xl" fontWeight="bold">
          Giỏ hàng của bạn
        </Text>
        <ItemCart />
      </Box>
    </Layout>
  );
};

export default CartPage;
