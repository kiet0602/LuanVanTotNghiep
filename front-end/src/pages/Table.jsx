import React, { useState } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tfoot,
  Tr,
  Input,
  Box,
  Button,
  HStack,
  Image,
} from "@chakra-ui/react";

// Dữ liệu mẫu cho giỏ hàng với hình ảnh sản phẩm
const initialCartItems = [
  {
    id: 1,
    name: "Cactus",
    price: 10.0,
    quantity: 1,
    imageUrl: "https://bit.ly/ryan-florence",
  },
  {
    id: 2,
    name: "Succulent",
    price: 20.0,
    quantity: 2,
    imageUrl: "https://bit.ly/ryan-florence",
  },
  {
    id: 3,
    name: "Fern",
    price: 30.0,
    quantity: 1,
    imageUrl: "https://bit.ly/ryan-florence",
  },
];

const Table1111 = () => {
  // Trạng thái cho danh sách mặt hàng trong giỏ hàng
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: parseInt(newQuantity, 10) || 0 }
          : item
      )
    );
  };

  // Hàm xử lý tăng số lượng
  const handleIncrease = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Hàm xử lý giảm số lượng
  const handleDecrease = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
          : item
      )
    );
  };

  // Tính tổng giá
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <Box>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th isNumeric textAlign="center">
                Price
              </Th>
              <Th textAlign="center">Quantity</Th>
              <Th isNumeric textAlign="center">
                Total
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {cartItems.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    boxSize="50px"
                    borderRadius={30}
                    objectFit="cover"
                  />
                </Td>
                <Td>{item.name}</Td>
                <Td isNumeric>${item.price.toFixed(2)}</Td>
                <Td textAlign="center">
                  <HStack spacing={2} justifyContent="center" align="center">
                    <Button
                      size="sm"
                      onClick={() => handleDecrease(item.id)}
                      disabled={item.quantity <= 0}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      size="sm"
                      width="60px"
                      textAlign="center"
                      min="0"
                    />
                    <Button size="sm" onClick={() => handleIncrease(item.id)}>
                      +
                    </Button>
                  </HStack>
                </Td>
                <Td isNumeric>${(item.price * item.quantity).toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th colSpan={4}>Total</Th>
              <Th isNumeric>${calculateTotal()}</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Table1111;
