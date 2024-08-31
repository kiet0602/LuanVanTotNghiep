import React from "react";
import {
  Box,
  Badge,
  SimpleGrid,
  Container,
  Image,
  Link,
  Text,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const CardNew = ({ products }) => {
  return (
    <Container maxWidth="1200px" mx="auto" my="auto" p={{ base: 5, md: 10 }}>
      <SimpleGrid columns={[1, 2, 3]} spacing="15px">
        {products.map((product) => {
          return (
            <Box
              position="relative"
              key={product.id}
              _hover={{ ".overlay": { opacity: 1 } }}
            >
              {/* Nhãn dán khuyến mãi */}
              <Box
                position="absolute"
                top="5px"
                left="5px"
                backgroundColor="white"
                borderRadius="full"
                borderWidth="2px"
                borderColor="red.400"
                px="3"
                py="1"
                zIndex="1"
                textAlign="center"
                fontSize="sm"
                color="red.500"
              >
                -10%
              </Box>

              {/* Các nút thêm vào giỏ hàng và yêu thích */}
              <Box
                className="overlay"
                position="absolute"
                top="5px"
                right="5px"
                display="flex"
                gap="10px"
                opacity="0"
                transition="opacity 0.3s ease"
                zIndex="1"
                p="2"
              >
                <Tooltip label="Add to Cart" aria-label="Add to Cart">
                  <IconButton
                    icon={<FaShoppingCart />}
                    size="md"
                    variant="outline"
                    colorScheme="teal"
                    aria-label="Add to Cart"
                    borderColor="teal.500"
                    borderWidth="2px"
                    borderRadius="full"
                    bg="white"
                    _hover={{ bg: "teal.50" }}
                  />
                </Tooltip>
                <Tooltip label="Add to Favorite" aria-label="Add to Favorite">
                  <IconButton
                    icon={<FaHeart />}
                    size="md"
                    variant="outline"
                    colorScheme="pink"
                    aria-label="Add to Favorite"
                    borderColor="pink.500"
                    borderWidth="2px"
                    borderRadius="full"
                    bg="white"
                    _hover={{ bg: "pink.50" }}
                  />
                </Tooltip>
                <Tooltip label="View Details" aria-label="View Details">
                  <IconButton
                    icon={<FaEye />}
                    size="md"
                    variant="outline"
                    colorScheme="blue"
                    aria-label="View Details"
                    borderColor="blue.500"
                    borderWidth="2px"
                    borderRadius="full"
                    bg="white"
                    _hover={{ bg: "blue.50" }}
                  />
                </Tooltip>
              </Box>

              {/* Nội dung thẻ */}
              <NavLink to="#">
                <Box
                  borderWidth="1px"
                  shadow="md"
                  rounded="lg"
                  overflow="hidden"
                  position="relative"
                >
                  <Image
                    src={`http://localhost:2000/images/${product?.image}`}
                    alt="Blog image"
                    // Ensure the image covers the container
                  />
                  <Box p={{ base: 4, lg: 6 }}>
                    <Box d="flex" alignItems="baseline">
                      <Box
                        fontWeight="semibold"
                        as="h2"
                        letterSpacing="wide"
                        textTransform="uppercase"
                        ml="2"
                      >
                        {product?.productName}
                      </Box>
                    </Box>
                    <Box>
                      <Box color="gray.600" fontSize="sm">
                        <Badge rounded="full" px="2" colorScheme="teal">
                          {product?.price}
                        </Badge>
                      </Box>
                    </Box>
                    <Text
                      mt="1"
                      fontWeight="semibold"
                      noOfLines={3}
                      lineHeight="tight"
                      color="gray.600"
                      fontSize="sm"
                    >
                      {product?.description}
                    </Text>
                  </Box>
                </Box>
              </NavLink>
            </Box>
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

export default CardNew;
