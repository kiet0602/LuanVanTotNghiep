import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  VStack,
  Heading,
  Flex,
  Text,
  Image,
  Container,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Link,
  Button,
  Spinner, // Thêm Spinner để hiển thị khi loading
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
//services
import {
  getCartById,
  updateItemQuantity,
  removeFromCart,
} from "../service/cartService.js";
//Atom
import { useRecoilValue } from "recoil";
import userAtom from "../Atom/userAtom.js";
import { toast } from "react-toastify";
import axios from "axios";

const ItemCart = () => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id; // Sử dụng optional chaining để tránh lỗi khi user không tồn tại
  const [cart, setCart] = useState(null); // State giỏ hàng
  const [loading, setLoading] = useState(true); // State loading

  const boxBgColor = useColorModeValue("white", "gray.700");
  const boxBorderColor = useColorModeValue("gray.200", "gray.600");

  // Hàm lấy giỏ hàng
  const fetchCart = async () => {
    if (!userId) return; // Nếu không có userId, không thực hiện hàm fetchCart

    try {
      const cartData = await getCartById(userId);
      setCart(cartData); // Cập nhật giỏ hàng
      setLoading(false); // Đặt loading về false khi dữ liệu đã được tải xong
    } catch (error) {
      console.log(error);
      setLoading(false); // Dừng loading ngay cả khi xảy ra lỗi
    }
  };

  useEffect(() => {
    if (userId) {
      if (!cart || (cart && cart.items.length === 0)) {
        fetchCart();
      }
    }
  }, [userId, cart]);

  const handleQuantityChange = async (productId, value) => {
    if (!userId) {
      toast.error("Bạn cần đăng nhập để thay đổi số lượng sản phẩm.");
      return;
    }

    const quantity = parseInt(value, 10);
    if (isNaN(quantity) || quantity < 1) {
      return;
    }
    try {
      await updateItemQuantity(userId, productId, quantity);
      fetchCart();
    } catch (error) {
      toast.error(`Lỗi khi cập nhật số lượng: ${error.message}`);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (!userId) {
      toast.error("Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:2000/api/cart/deleteProductFromCart`,
        {
          userId,
          productId,
        }
      );

      if (response.status === 200) {
        fetchCart();
        toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
      } else {
        toast.error(`Lỗi khi xóa sản phẩm: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
  };

  // Nếu đang loading, hiển thị Spinner
  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="6xl" p={{ base: 5, md: 12 }}>
      {cart?.items.length > 0 ? (
        <>
          <VStack spacing={4} marginBottom={6} align="left" mx={[0, 0, 6]}>
            {cart.items.map((item) => (
              <Box
                key={item?._id}
                px={4}
                py={5}
                bg={boxBgColor}
                borderWidth="1px"
                borderColor={boxBorderColor}
                _hover={{ shadow: "lg" }}
                position="relative"
                rounded="md"
              >
                <Flex justifyContent="space-between">
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align="center"
                    p={4}
                  >
                    <Image
                      rounded="full"
                      w={{ base: 12, md: 16 }}
                      h={{ base: 12, md: 16 }}
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/150"
                      src={`http://localhost:2000/images/${item?.product?.image[0]}`}
                    />
                    <Stack
                      spacing={2}
                      pl={{ base: 0, md: 3 }}
                      align="left"
                      justify="center"
                    >
                      <Heading width={"100px"} align="left" fontSize={"sm"}>
                        {item?.product?.productName}
                      </Heading>
                    </Stack>
                  </Flex>
                  <Stack spacing={2} pl={3} align="center" justify="center">
                    <Heading fontSize="sm">Số lượng</Heading>
                    <NumberInput
                      min={1}
                      max={item?.product?.quantity}
                      size="sm"
                      maxW="150px"
                      value={item?.quantity}
                      onChange={(valueString) =>
                        handleQuantityChange(item?.product._id, valueString)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Stack>
                  <Stack spacing={2} pl={3} align="center" justify="center">
                    <Heading align="left" fontSize="sm">
                      Giá
                    </Heading>
                    <Heading align="left" fontSize="sm">
                      {item?.totalPriceItemCart.toLocaleString()} VNĐ
                    </Heading>
                  </Stack>
                  <Stack spacing={2} pl={3} align="center" justify="center">
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                      p={4}
                    >
                      <FontAwesomeIcon
                        icon={faCartShopping}
                        cursor={"pointer"}
                        style={{
                          color: "#B197FC",
                          fontSize: "24px",
                          marginRight: "16px",
                        }}
                      />
                      <FontAwesomeIcon
                        onClick={() => handleRemoveFromCart(item?.product._id)}
                        cursor={"pointer"}
                        icon={faTrash}
                        style={{ color: "#f01435", fontSize: "24px" }}
                      />
                    </Flex>
                  </Stack>
                </Flex>
              </Box>
            ))}
          </VStack>
          <Link
            as={NavLink}
            to="/shop"
            textDecoration="none"
            fontStyle="italic"
            _hover={{
              textDecoration: "underline",
            }}
            transition="color 0.2s"
          >
            Tiếp tục mua sắm
          </Link>
          <Flex direction="column" align="flex-end" mt={4} p={4} rounded="md">
            <Heading fontSize="lg">
              Tổng tiền:{" "}
              <Text as="span" color="red.500">
                {cart?.totalPrice.toLocaleString()}
              </Text>{" "}
              VNĐ
            </Heading>

            <Button mt={2} width={"230px"} colorScheme="teal">
              Thanh toán
            </Button>
          </Flex>
        </>
      ) : (
        <Flex direction="column" align="center" justify="center">
          <Heading fontSize="xl" color="red.500">
            Xin lỗi, giỏ hàng của bạn không có sản phẩm nào
          </Heading>
          <Link
            as={NavLink}
            to="/shop"
            textDecoration="none"
            fontStyle="italic"
            _hover={{
              textDecoration: "underline",
            }}
            transition="color 0.2s"
            mt={4}
          >
            Quay lại cửa hàng
          </Link>
        </Flex>
      )}
    </Container>
  );
};

export default ItemCart;
