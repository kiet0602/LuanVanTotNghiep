import { useEffect, useState } from "react";
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
  Spinner,
  Checkbox, // Thêm Checkbox
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import {
  getCartById,
  updateItemQuantity,
  removeFromCart,
} from "../service/cartService";
import { toast } from "react-toastify";

const ItemCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]); // Thêm state để lưu các sản phẩm được chọn

  const navigate = useNavigate();
  const boxBgColor = useColorModeValue("white", "gray.700");
  const boxBorderColor = useColorModeValue("gray.200", "gray.600");

  const fetchCart = async () => {
    // if (!userId) return;
    try {
      const response = await getCartById();
      setCart(response.cart);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Thay đổi số lượng sản phẩm trong giỏ hàng
  const handleQuantityChange = async (productId, value) => {
    const quantity = parseInt(value, 10);
    if (isNaN(quantity) || quantity < 1) return;
    const productInCart = cart.items.find(
      (item) => item.product._id === productId
    );
    if (!productInCart) {
      toast.error("Sản phẩm không tồn tại trong giỏ hàng.");
      return;
    }
    try {
      await updateItemQuantity(productId, quantity);
      fetchCart();
    } catch (error) {
      console.log(`Lỗi khi cập nhật số lượng: ${error.message}`);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      // Hiển thị thông báo thành công
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");

      // Cập nhật trạng thái giỏ hàng ngay lập tức
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.product._id !== productId),
      }));
    } catch (error) {
      toast.error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
  };

  // Chọn/bỏ chọn sản phẩm để thanh toán
  const handleSelectItem = (productId) => {
    setSelectedItems(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId) // Bỏ chọn
          : [...prevSelected, productId] // Chọn thêm
    );
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Bạn chưa chọn sản phẩm nào để thanh toán.");
      return;
    }
    const itemsToPay = cart.items.filter((item) =>
      selectedItems.includes(item.product._id)
    );
    const totalPrice = itemsToPay.reduce(
      (total, item) => total + item.totalPriceItemCart,
      0
    );
    // Chuyển đến trang thanh toán và truyền các sản phẩm được chọn cùng tổng tiền
    navigate("/checkout", { state: { items: itemsToPay, total: totalPrice } });
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="7xl" p={{ base: 5, md: 12 }}>
      {cart && cart?.items && cart?.items?.length > 0 ? (
        <VStack spacing={4} marginBottom={6} align="left" mx={[0, 0, 6]}>
          {cart.items.map((item) => {
            const isOutOfStock = item?.product?.quantity === 0;
            const isExceedStock = item?.quantity > item?.product?.quantity;

            return (
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
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  p={4}
                  w="100%"
                >
                  <Checkbox
                    isChecked={selectedItems.includes(item?.product?._id)}
                    isDisabled={isOutOfStock || isExceedStock}
                    onChange={() => handleSelectItem(item?.product?._id)}
                  />
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align="center"
                    justifyContent="center"
                  >
                    <Image
                      rounded="full"
                      w={{ base: 12, md: 16 }}
                      h={{ base: 12, md: 16 }}
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/150"
                      src={`http://localhost:2000/images/${item?.product?.image[0]}`}
                    />
                    <Stack spacing={2} pl={{ base: 0, md: 3 }} align="center">
                      <Heading
                        width={"100px"}
                        fontSize={"sm"}
                        textAlign="center"
                      >
                        {item?.product?.productName}
                      </Heading>
                      {(isOutOfStock || isExceedStock) && (
                        <Text color="red.500" fontSize="xs">
                          {isOutOfStock
                            ? "Sản phẩm này đã hết hàng"
                            : `Chỉ còn ${item?.product?.quantity} sản phẩm trong kho`}
                        </Text>
                      )}
                    </Stack>
                  </Flex>
                  <Stack spacing={2} align="center" justifyContent="center">
                    <Heading fontSize="sm">Số lượng</Heading>
                    <NumberInput
                      min={1}
                      max={item?.product?.quantity}
                      size="sm"
                      maxW="150px"
                      value={item?.quantity}
                      isDisabled={isOutOfStock || isExceedStock}
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
                  <Stack spacing={2} align="center" justifyContent="center">
                    <Heading fontSize="sm">Giá</Heading>
                    <Text>{item?.totalPriceItemCart.toLocaleString()} Đ</Text>
                  </Stack>
                  <FontAwesomeIcon
                    mx="20px"
                    onClick={() => handleRemoveFromCart(item?.product?._id)}
                    cursor="pointer"
                    icon={faTrash}
                    style={{ color: "#f01435", fontSize: "24px" }}
                  />
                </Flex>
              </Box>
            );
          })}
          <Link
            as={NavLink}
            to="/products"
            textDecoration="none"
            fontStyle="italic"
            _hover={{ textDecoration: "underline" }}
            transition="color 0.2s"
          >
            Tiếp tục mua sắm
          </Link>
          <Flex direction="column" align="flex-end" mt={4}>
            <Heading fontSize="lg">
              Tổng tiền:{" "}
              <Text as="span" color="red.500">
                {selectedItems.length > 0
                  ? cart.items
                      .filter((item) =>
                        selectedItems.includes(item?.product?._id)
                      )
                      .reduce(
                        (total, item) => total + item?.totalPriceItemCart,
                        0
                      )
                      .toLocaleString()
                  : 0}
              </Text>{" "}
              Đ
            </Heading>
            <Button
              mt="5px"
              px="50px"
              borderRadius="none"
              bg="white"
              color="black"
              fontWeight="300"
              boxShadow="sm"
              onClick={handleCheckout}
            >
              Mua Ngay
            </Button>
          </Flex>
        </VStack>
      ) : (
        <Flex direction="column" align="center">
          <Heading fontSize="xl" color="red.500">
            Xin lỗi, giỏ hàng của bạn không có sản phẩm nào
          </Heading>
          <Link
            as={NavLink}
            to="/"
            textDecoration="none"
            fontStyle="italic"
            _hover={{ textDecoration: "underline" }}
          >
            Quay lại cửa hàng
          </Link>
        </Flex>
      )}
    </Container>
  );
};

export default ItemCart;
