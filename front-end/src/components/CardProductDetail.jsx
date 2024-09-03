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
  List,
  ListItem,
  Badge,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import Breadcrumbss from "./Breadcrumbss";

const CardProductDetail = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (product?.variants.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  if (!selectedVariant) return null; // Đảm bảo rằng có variant được chọn trước khi hiển thị

  return (
    <Container maxW={"7xl"}>
      {/* Breadcrumbs component at the top */}
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
            src={`http://localhost:2000/images/${product?.image}`}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Stack>

        <Stack spacing={{ base: 6, md: 10 }}>
          {/* Product Title and Price */}
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {product?.productName}
            </Heading>
            <Text
              color={useColorModeValue("red.400", "gray.400")}
              fontWeight={300}
              fontSize={"2xl"}
            >
              <Flex alignItems="center">
                <Text mr={4} fontSize="xl" fontWeight="bold">
                  Giá:
                </Text>
                <Badge
                  rounded="full"
                  px="4" // Điều chỉnh padding-x để thẻ lớn hơn
                  py="2" // Điều chỉnh padding-y nếu cần
                  colorScheme="teal"
                  fontSize="lg" // Điều chỉnh kích thước font
                >
                  ${selectedVariant?.price}
                </Badge>
              </Flex>
            </Text>
            <Text color={useColorModeValue("gray.400", "gray.400")}>
              Kích thước: {selectedVariant?.size}
            </Text>
            <Text color={useColorModeValue("gray.400", "gray.400")}>
              Số lượng còn lại: {selectedVariant?.quantity}
            </Text>
          </Box>

          {/* Product Description and Details */}
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.200", "gray.600")}
              />
            }
          >
            <VStack spacing={{ base: 4, sm: 1 }} align="start">
              <Text
                color={useColorModeValue("gray.500", "gray.400")}
                fontSize={"2xl"}
                fontWeight={"300"}
              >
                MÔ TẢ
              </Text>
              <Flex width="100%" justify="space-between" mb={2}>
                <Box width="40%" fontWeight="bold">
                  Màu sắc:
                </Box>
                <Box width="60%" textAlign="center">
                  {product?.color?.nameColor}
                </Box>
              </Flex>
              <Flex width="100%" justify="space-between" mb={2}>
                <Box width="40%" fontWeight="bold">
                  Thuộc loại:
                </Box>
                <Box width="60%" textAlign="center">
                  {product?.category?.categoryName}
                </Box>
              </Flex>
              <Flex width="100%" justify="space-between" mb={2}>
                <Box width="40%" fontWeight="bold">
                  Môi trường ưa thích:
                </Box>
                <Box width="60%" textAlign="center">
                  {product?.environment?.nameEnviroment}
                </Box>
              </Flex>
            </VStack>

            {/* Variant Selection */}
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("green.500", "green.300")}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Chọn kích thước:
              </Text>
              <Stack direction="row" spacing={4}>
                {product?.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    onClick={() => handleVariantChange(variant)}
                    border="2px solid"
                    borderColor={
                      selectedVariant?.id === variant.id
                        ? "green.500"
                        : "gray.300"
                    }
                    bg={
                      selectedVariant?.id === variant.id
                        ? "white"
                        : "transparent"
                    }
                    color={
                      selectedVariant?.id === variant.id
                        ? "green.500"
                        : "gray.700"
                    }
                    _hover={{ bg: "gray.100" }}
                    _active={{ bg: "gray.200" }}
                    px={4}
                    py={2}
                  >
                    {variant.size}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Button
            rounded={"none"}
            w={"full"}
            size={"lg"}
            bg={useColorModeValue("green.900", "green.50")}
            color={useColorModeValue("white", "green.900")}
            textTransform={"uppercase"}
            _hover={{
              transform: "translateY(2px)",
              boxShadow: "lg",
            }}
          >
            Add to cart
          </Button>

          <Stack direction="row" alignItems="center" justifyContent={"center"}>
            <MdLocalShipping />
            <Text>2-3 business days delivery</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default CardProductDetail;
