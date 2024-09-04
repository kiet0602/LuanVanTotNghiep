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
import Breadcrumbss from "./Breadcrumbss";
import AccordionDetailProduct from "./AccordionDetailProduct";

const CardProductDetail = ({ product }) => {
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const borderColor = useColorModeValue("teal.500", "teal.300"); // Light and dark mode colors
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    if (product?.image && product.image.length > 0) {
      setMainImage(`http://localhost:2000/images/${product.image[0]}`);
    } else {
      setMainImage(null); // Default image handling or empty state
    }
  }, [product]);

  const displayPrice =
    product?.discount > 0 ? product.finalPrice : product.originalPrice;

  const priceToDisplay = displayPrice ?? 0;

  const totalPriceProduct = product.finalPrice * quantity;

  return (
    <>
      {!product ? (
        <Center height="100vh">
          <Spinner size="xl" color="teal.500" />
        </Center>
      ) : (
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
                  <Flex alignItems="center">
                    <Text mr={4} fontSize="xl" fontWeight="bold">
                      Giá:
                    </Text>
                    <Badge
                      rounded="full"
                      px="4"
                      py="2"
                      colorScheme="teal"
                      fontSize="lg"
                    >
                      {priceToDisplay.toLocaleString("vi-VN")} VND
                    </Badge>
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
                      Chiều cao:
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
                    <Box width="60%" textAlign="end" fontWeight="bold">
                      {product?.quantity}
                    </Box>
                  </Flex>
                </VStack>
              </Stack>
              <Box mt={4}>
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
                      {totalPriceProduct.toLocaleString("vi-VN")} VNĐ
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Button
                bgColor={"gray.300"}
                rounded={"10"}
                w={"full"}
                size={"lg"}
                textTransform={"uppercase"}
                _hover={{
                  transform: "translateY(5px)",
                  boxShadow: "lg",
                }}
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
      )}
    </>
  );
};

export default CardProductDetail;
