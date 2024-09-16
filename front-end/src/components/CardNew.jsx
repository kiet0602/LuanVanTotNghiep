import React, { useEffect, useState } from "react";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

//Atom
import userAtom from "../Atom/userAtom.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesAtom, favoritesCountAtom } from "../Atom/favoritesAtom.js";
//service
import { addToCart } from "../service/cartService.js";
import {
  addFavoriteProduct,
  getAllFavoriteProducts,
  removeFavoriteProduct,
} from "../service/favoritesService.js";

const CardNew = ({ products }) => {
  const bgColor = useColorModeValue("whiteAlpha.800", "blackAlpha.800"); // Background overlay color
  const textColor = useColorModeValue("black", "white"); // Text color
  const hoverBg = useColorModeValue("blue.50", "blue.600");
  const borderColor = useColorModeValue("blue.500", "blue.300");
  //Atom
  const user = useRecoilValue(userAtom);
  const [favoriteProducts, setFavoriteProducts] = useRecoilState(favoritesAtom);
  const [favoritesCount, setFavoritesCount] =
    useRecoilState(favoritesCountAtom);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?._id) return; // If userId is not available, exit early
      try {
        const userId = user._id;
        const favorites = await getAllFavoriteProducts(userId);
        setFavoriteProducts(favorites);
        setFavoritesCount(favorites.length);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
      }
    };

    fetchFavorites();
  }, [user, setFavoriteProducts, setFavoritesCount]); // Dependency on user

  const isFavorite = (productId) =>
    favoriteProducts.some((fav) => fav._id === productId);

  //Hàm sử lý
  const handleAddToCart = async (productId) => {
    if (!user?._id) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    try {
      const quantity = 1;
      const response = await addToCart(user._id, productId, quantity);
      toast.success("Sản phẩm đã thêm vào giỏ hàng");
    } catch (error) {
      toast.error("Lỗi thêm sản phẩm!");
    }
  };

  const handleAddFavorite = async (productId) => {
    if (!user?._id) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào yêu thích");
      return;
    }

    try {
      await addFavoriteProduct(user._id, productId);
      toast.success("Đã thích sản phẩm");
      setFavoriteProducts((prevFavorites) => [
        ...prevFavorites,
        { _id: productId },
      ]);
      setFavoritesCount((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem("favoritesCount", JSON.stringify(newCount));
        return newCount;
      });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    if (!user?._id) {
      toast.error("Bạn cần đăng nhập để bỏ yêu thích sản phẩm");
      return;
    }

    try {
      await removeFavoriteProduct(user._id, productId);
      toast.success("Đã bỏ thích sản phẩm");
      setFavoriteProducts((prevFavorites) =>
        prevFavorites.filter((fav) => fav._id !== productId)
      );
      setFavoritesCount((prevCount) => {
        const newCount = prevCount - 1;
        localStorage.setItem("favoritesCount", JSON.stringify(newCount));
        return newCount;
      });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleFavoriteToggle = (productId) => {
    if (isFavorite(productId)) {
      handleRemoveFavorite(productId);
    } else {
      handleAddFavorite(productId);
    }
  };

  return (
    <Container maxWidth="1200px" mx="auto" my="auto" p={{ base: 5, md: 10 }}>
      <SimpleGrid columns={[1, 2, 3]} spacing="15px">
        {products.map((product, index) => {
          return (
            <Box
              position="relative"
              key={index}
              _hover={{ ".overlay": { opacity: 1 } }}
            >
              {/* Nhãn dán khuyến mãi */}
              {product?.discount > 0 && (
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
                  as="i"
                >
                  - {product?.discount}%
                </Box>
              )}

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
                <Tooltip
                  label="Thêm vào giỏ hàng"
                  aria-label="Thêm vào giỏ hàng"
                >
                  <IconButton
                    onClick={() => handleAddToCart(product._id)}
                    icon={<FaShoppingCart />}
                    size="md"
                    variant="outline"
                    colorScheme="blue"
                    aria-label="Add to Cart"
                    borderColor={borderColor}
                    borderWidth="2px"
                    borderRadius="full"
                    bg={bgColor}
                    _hover={{ bg: hoverBg }}
                    _active={{ bg: hoverBg, borderColor: borderColor }}
                    _focus={{ boxShadow: "outline" }} // Ensures proper focus styles
                  />
                </Tooltip>
                <Tooltip label="Yêu thích" aria-label="Yêu thích">
                  <IconButton
                    onClick={() => handleFavoriteToggle(product._id)}
                    icon={<FaHeart />}
                    size="md"
                    variant="outline"
                    colorScheme="red"
                    aria-label="Add to Favorite"
                    borderColor={borderColor}
                    borderWidth="2px"
                    borderRadius="full"
                    bg={bgColor}
                    _hover={{ bg: hoverBg }}
                    _active={{ bg: hoverBg, borderColor: borderColor }}
                    _focus={{ boxShadow: "outline" }}
                    color={isFavorite(product._id) ? "red.500" : "black"}
                  />
                </Tooltip>
                <NavLink to={`/productDetail/${product?._id}`}>
                  <Tooltip label="Xem chi tiết" aria-label="Xem chi tiết">
                    <IconButton
                      icon={<FaEye />}
                      size="md"
                      variant="outline"
                      colorScheme="white"
                      aria-label="View Details"
                      borderColor={borderColor}
                      borderWidth="2px"
                      borderRadius="full"
                      bg={bgColor}
                      _hover={{ bg: hoverBg }}
                      _active={{ bg: hoverBg, borderColor: borderColor }}
                      _focus={{ boxShadow: "outline" }} // Ensures proper focus styles
                    />
                  </Tooltip>
                </NavLink>
              </Box>

              {/* Nội dung thẻ */}
              <NavLink to={`/productDetail/${product?._id}`}>
                <Box
                  borderWidth="1px"
                  shadow="md"
                  rounded="lg"
                  overflow="hidden"
                  position="relative"
                >
                  <Image
                    src={`http://localhost:2000/images/${product.image[0]}`}
                    alt="Product image"
                    // Ensure the image covers the container
                  />
                  <Box p={{ base: 4, lg: 6 }}>
                    <Box d="flex" alignItems="center" justifyContent="center">
                      <Box
                        fontWeight="semibold"
                        as="h2"
                        letterSpacing="wide"
                        textTransform="uppercase"
                        ml="2"
                        textAlign="center"
                      >
                        {product?.productName}
                      </Box>
                    </Box>
                    <Box>
                      {/* Price centered */}
                      <Box display="flex" justifyContent="center">
                        <Box
                          fontWeight="semibold"
                          as="h2"
                          letterSpacing="wide"
                          ml="2"
                          textAlign="center"
                        >
                          <Text
                            as="span"
                            fontStyle="italic"
                            fontWeight="light"
                            mr="2"
                            textColor
                          >
                            Giá:
                          </Text>
                          {product.finalPrice !== product.originalPrice && (
                            <>
                              <Badge
                                rounded="full"
                                px="3"
                                fontSize="sm"
                                textDecoration="line-through"
                                color="gray.500"
                              >
                                {product.originalPrice.toLocaleString("vi-VN")}Đ
                              </Badge>
                              <Badge rounded="full" px="3" mx="1" fontSize="sm">
                                {product.finalPrice.toLocaleString("vi-VN")}Đ
                              </Badge>
                            </>
                          )}
                          {/* Nếu không có finalPrice, chỉ hiển thị originalPrice */}
                          {product.finalPrice === product.originalPrice && (
                            <Badge rounded="full" px="3" fontSize="sm">
                              {product.originalPrice.toLocaleString("vi-VN")}Đ
                            </Badge>
                          )}
                        </Box>
                      </Box>

                      {/* Other badges aligned to the end */}
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap="2" // Optional: adds space between badges
                        color="gray.600"
                        fontSize="large"
                        mt="2" // Optional: adds some margin-top for spacing
                      >
                        <Badge rounded="full" px="2" colorScheme="teal">
                          Màu sắc: {product?.color?.nameColor}
                        </Badge>
                        <Badge rounded="full" px="2" colorScheme="teal">
                          Đánh giá: {product?.ratingsCount}
                        </Badge>
                        <Badge rounded="full" px="2" colorScheme="teal">
                          Bán: {product?.orderCount}
                        </Badge>
                      </Box>
                    </Box>

                    <Text
                      mt="1"
                      fontWeight="semibold"
                      noOfLines={3}
                      lineHeight="tight"
                      textColor
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
