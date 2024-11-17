import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  Badge,
  Spinner,
  Center,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
//component
import Breadcrumbss from "./Breadcrumbss";
import AccordionDetailProduct from "./AccordionDetailProduct";
//services
import { addToCart } from "../service/cartService.js";
//Atom
import userTokenAtom from "../Atom/userAtom.js";
import { useRecoilState, useRecoilValue } from "recoil";

import { toast } from "react-toastify";
import ProductViewerModal from "./ProductViewerModal.jsx";

const CardProductDetail = ({ product }) => {
  const token = useRecoilValue(userTokenAtom);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const borderColor = useColorModeValue("teal.500", "teal.300"); // Light and dark mode colors
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    if (product?.image && product?.image.length > 0) {
      setMainImage(`http://localhost:2000/images/${product?.image[0]}`);
    } else {
      setMainImage(null); // Default image handling or empty state
    }
  }, [product]);

  const displayPrice =
    product?.discount > 0 ? product.finalPrice : product.originalPrice;
  const priceToDisplay = displayPrice ?? 0;
  const totalPriceProduct = product.finalPrice * quantity;

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng");
      return;
    }
    try {
      if (!product || product.quantity <= 0) {
        toast.error("Sản phẩm này đã hết hàng!");
        return;
      }
      await addToCart(productId, quantity);
      toast.success("Sản phẩm đã thêm vào giỏ hàng");
    } catch (error) {
      toast.error("Lỗi thêm sản phẩm!");
    }
  };

  return (
    <>
      {!product ? (
        <Center height="100vh">
          <Spinner size="xl" color="teal.500" />
        </Center>
      ) : (
        <Box bg={useColorModeValue("green.100", "black")}>
          <Container maxW={"7xl"}>
            <Breadcrumbss />
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={{ base: 8, md: 10 }}
              py={{ base: 12, md: 16 }}
              mt={{ base: -6, md: -8 }}
            >
              <Stack>
                <Image
                  rounded={"md"}
                  alt={"product image"}
                  src={mainImage}
                  fit={"cover"}
                  align={"center"}
                  w={"100%"}
                  h={{ base: "100%", sm: "400px", lg: "500px" }}
                  bgColor={bgColor}
                />
                <ProductViewerModal product={product} />
                <Flex mt={4}>
                  {product?.image.map((img, idx) => (
                    <Image
                      key={idx}
                      src={`http://localhost:2000/images/${img}`}
                      alt={`product image ${idx + 1}`}
                      fit={"cover"}
                      boxSize={"80px"}
                      objectFit="cover"
                      borderRadius={"10px"}
                      border={
                        mainImage === `http://localhost:2000/images/${img}`
                          ? `2px solid ${borderColor}`
                          : "none"
                      }
                      cursor="pointer"
                      onClick={() =>
                        setMainImage(`http://localhost:2000/images/${img}`)
                      }
                      mr={2}
                    />
                  ))}
                </Flex>
              </Stack>

              <Stack spacing={{ base: 6, md: 10 }}>
                <Box as={"header"}>
                  <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                    color={textColor}
                  >
                    {product?.productName}
                  </Heading>
                  <Box fontWeight={300} fontSize={"2xl"}>
                    <Flex alignItems="center" pt={"20px"}>
                      <Text mr={4} fontSize="xl" fontWeight="bold">
                        Giá:
                      </Text>
                      {/* Kiểm tra nếu có giá giảm và khác với giá gốc */}
                      {product?.finalPrice !== product?.originalPrice ? (
                        <>
                          <Badge
                            rounded="full"
                            px="4"
                            py="2"
                            colorScheme="gray"
                            fontSize="lg"
                            textDecoration="line-through"
                          >
                            {product?.originalPrice.toLocaleString("vi-VN")} Đ
                          </Badge>
                          <Badge
                            rounded="full"
                            px="4"
                            py="2"
                            colorScheme="teal"
                            fontSize="lg"
                          >
                            {product?.finalPrice.toLocaleString("vi-VN")} Đ
                          </Badge>
                        </>
                      ) : (
                        // Nếu không có giá giảm, chỉ hiển thị giá gốc
                        <Badge
                          rounded="full"
                          px="4"
                          py="2"
                          colorScheme="teal"
                          fontSize="lg"
                        >
                          {product?.originalPrice.toLocaleString("vi-VN")} Đ
                        </Badge>
                      )}
                    </Flex>
                  </Box>
                </Box>
                <Stack
                  spacing={{ base: 4, sm: 6 }}
                  direction={"column"}
                  divider={<StackDivider />}
                >
                  <VStack spacing={{ base: 4, sm: 1 }} align="start">
                    <Text fontSize={"2xl"} fontWeight={"300"}>
                      MÔ TẢ
                    </Text>
                    <Flex width="100%" justify="space-between" mb={2}>
                      <Box width="40%" as="i">
                        Màu sắc:
                      </Box>
                      <Box width="60%" textAlign="end" fontWeight="bold">
                        {product?.color?.nameColor}
                      </Box>
                    </Flex>
                    <Flex width="100%" justify="space-between" mb={2}>
                      <Box width="40%" as="i">
                        Thuộc loại:
                      </Box>
                      <Box width="60%" textAlign="end" fontWeight="bold">
                        {product?.category?.categoryName}
                      </Box>
                    </Flex>
                    <Flex width="100%" justify="space-between" mb={2}>
                      <Box width="40%" as="i">
                        Môi trường ưa thích:
                      </Box>
                      <Box width="60%" textAlign="end" fontWeight="bold">
                        {product?.environment?.nameEnviroment}
                      </Box>
                    </Flex>
                    <Flex width="100%" justify="space-between" mb={2}>
                      <Box width="40%" as="i">
                        Mức độ cần chăm sóc:
                      </Box>
                      <Box width="60%" textAlign="end" fontWeight="bold">
                        {product?.care}
                      </Box>
                    </Flex>
                    <Flex width="100%" justify="space-between" mb={2}>
                      <Box width="40%" as="i">
                        Kích cỡ:
                      </Box>
                      <Box width="60%" textAlign="end" fontWeight="bold">
                        {product?.size}
                      </Box>
                    </Flex>
                    <Divider />
                    <Flex width="100%" justify="space-between" mb={2}>
                      <Box width="40%" as="i">
                        Số lượng còn lại:
                      </Box>
                      {product?.quantity === 0 ? (
                        <Box width="60%" textAlign="end" fontWeight="bold">
                          <Text color={"red.400"}> Đã hết hàng</Text>
                        </Box>
                      ) : (
                        <Box width="60%" textAlign="end" fontWeight="bold">
                          {product?.quantity}
                        </Box>
                      )}
                    </Flex>
                  </VStack>
                </Stack>
                <Box mt={4}>
                  {product?.quantity === 0 ? (
                    <Text textAlign={"center"}>Sản phẩm đã hết</Text>
                  ) : (
                    <Flex alignItems="center">
                      <Text fontSize={"xl"} fontWeight="bold" mr={4}>
                        Số lượng:
                      </Text>

                      <NumberInput
                        defaultValue={1}
                        min={1}
                        max={product?.quantity} // Ensure quantity does not exceed available stock
                        value={quantity}
                        onChange={(valueString) =>
                          setQuantity(parseInt(valueString))
                        }
                        size="md"
                        maxW="150px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Box mx={5} display={"flex"}>
                        Tạm tính:
                        <Text color={"red"}>
                          {totalPriceProduct.toLocaleString("vi-VN")} Đ
                        </Text>
                      </Box>
                    </Flex>
                  )}
                </Box>
                <Button
                  onClick={() => handleAddToCart(product?._id)}
                  py="30px"
                  borderRadius="none"
                  bg="orange.200"
                  color="black"
                  fontWeight="300"
                  boxShadow="md" // Thêm bóng đổ nhẹ cho nút
                  size={"lg"}
                >
                  Thêm vào giỏ hàng
                </Button>

                <AccordionDetailProduct description={product?.description} />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={"center"}
                >
                  <MdLocalShipping />
                  <Text ml={2}>2-3 ngày làm việc để giao hàng</Text>
                </Stack>
              </Stack>
            </SimpleGrid>
          </Container>
        </Box>
      )}
    </>
  );
};

export default CardProductDetail;
