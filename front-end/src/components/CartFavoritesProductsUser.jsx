import React, { useEffect, useState } from "react";
import {
  Box,
  Badge,
  SimpleGrid,
  Container,
  Image,
  Text,
  IconButton,
  Tooltip,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { FaHeart, FaEye, FaShoppingCart, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
// Services
import { addToCart } from "../service/cartService.js";
// Atom
import userAtom from "../Atom/userAtom.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesAtom, favoritesCountAtom } from "../Atom/favoritesAtom.js";
import {
  getAllFavoriteProducts,
  removeFavoriteProduct,
} from "../service/favoritesService.js";

import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";

const CartFavoritesProductsUser = () => {
  const bgColor = useColorModeValue("whiteAlpha.800", "blackAlpha.800");
  const hoverBg = useColorModeValue("blue.50", "blue.600");
  const borderColor = useColorModeValue("blue.500", "blue.300");
  // Atom
  const user = useRecoilValue(userAtom);
  const [favoriteProductofUser, setFavoriteProductofUser] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useRecoilState(favoritesAtom);
  const [favoritesCount, setFavoritesCount] =
    useRecoilState(favoritesCountAtom);
  //Thêm giỏ hàng
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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?._id) return;
      try {
        const userId = user._id;
        const favorites = await getAllFavoriteProducts(userId);
        setFavoriteProducts(favorites);
        setFavoriteProductofUser(favorites);
        console.log(favorites);
        setFavoritesCount(favorites.length);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
      }
    };
    fetchFavorites();
  }, [user, setFavoriteProducts, setFavoritesCount]);

  const isFavorite = (productId) =>
    favoriteProductofUser.some((fav) => fav._id === productId);

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
    }
  };

  return (
    <>
      <Container maxWidth="1200px" mx="auto" my="auto" p={{ base: 5, md: 10 }}>
        <Flex
          fontSize="2xl"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          mb="5"
        >
          <Image height="30px" w="30px" src={imgSenda} mr="2" />{" "}
          {/* Khoảng cách giữa ảnh và văn bản */}
          <Text>Sản phẩm yêu thích của bạn</Text>
        </Flex>

        {favoriteProductofUser.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3]} spacing="15px">
            {favoriteProductofUser.map((favoriteProduct) => (
              <Box
                position="relative"
                key={favoriteProduct._id}
                _hover={{ ".overlay": { opacity: 1 } }}
              >
                {favoriteProduct?.discount > 0 && (
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
                    - {favoriteProduct?.discount}%
                  </Box>
                )}

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
                      onClick={() => handleAddToCart(favoriteProduct._id)}
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
                      _focus={{ boxShadow: "outline" }}
                    />
                  </Tooltip>
                  <Tooltip label="Bỏ yêu thích" aria-label=" Bỏ yêu thích">
                    <IconButton
                      onClick={() => handleFavoriteToggle(favoriteProduct._id)}
                      icon={<FaTimes />} // Thay thế FaHeart bằng FaTimes
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
                      color={
                        isFavorite(favoriteProduct._id) ? "red.500" : "black"
                      }
                    />
                  </Tooltip>
                  <NavLink to={`/productDetail/${favoriteProduct?._id}`}>
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
                        _focus={{ boxShadow: "outline" }}
                      />
                    </Tooltip>
                  </NavLink>
                </Box>

                <NavLink to={`/productDetail/${favoriteProduct?._id}`}>
                  <Box
                    borderWidth="1px"
                    shadow="md"
                    rounded="lg"
                    overflow="hidden"
                    position="relative"
                  >
                    <Image
                      src={`http://localhost:2000/images/${favoriteProduct.image[0]}`}
                      alt="Product image"
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
                          {favoriteProduct?.productName}
                        </Box>
                      </Box>
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
                          >
                            Giá:
                          </Text>
                          <Badge rounded="full" px="3" fontSize="xl">
                            {favoriteProduct.finalPrice.toLocaleString("vi-VN")}{" "}
                            Đ
                          </Badge>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap="2"
                        color="gray.600"
                        fontSize="large"
                        mt="2"
                      >
                        <Badge rounded="full" px="2" colorScheme="teal">
                          Màu sắc: {favoriteProduct?.color?.nameColor}
                        </Badge>
                        <Badge rounded="full" px="2" colorScheme="teal">
                          Đánh giá: {favoriteProduct?.ratingsCount}
                        </Badge>
                        <Badge rounded="full" px="2" colorScheme="teal">
                          Bán: {favoriteProduct?.orderCount}
                        </Badge>
                      </Box>
                      <Text
                        mt="1"
                        fontWeight="semibold"
                        noOfLines={3}
                        lineHeight="tight"
                        fontSize="sm"
                      >
                        {favoriteProduct?.description}
                      </Text>
                    </Box>
                  </Box>
                </NavLink>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text textAlign="center" mt="4">
            Bạn chưa có sản phẩm yêu thích nào.
          </Text>
        )}
      </Container>{" "}
    </>
  );
};

export default CartFavoritesProductsUser;
