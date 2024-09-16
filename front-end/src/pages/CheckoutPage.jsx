import React from "react";
import { Container, Flex, Box, Text, Button } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import InfoCartCheckout from "../components/InfoCartCheckout";
import InfoUserCheckout from "../components/InfoUserCheckout";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Truy cập vào danh sách sản phẩm và tổng tiền được truyền từ trang giỏ hàng
  const { items, total } = location.state || { items: [], total: 0 };

  return (
    <>
      <Layout>
        <div>
          {" "}
          <Container maxW="container.xl">
            <Flex
              h={{ base: "auto", md: "130vh" }}
              py={[0, 10, 20]}
              direction={{
                base: "column-reverse",
                md: "row",
              }}
            >
              <InfoUserCheckout />
              <InfoCartCheckout items={items} total={total} />
            </Flex>
          </Container>
        </div>
      </Layout>
    </>
  );
};

export default CheckoutPage;
