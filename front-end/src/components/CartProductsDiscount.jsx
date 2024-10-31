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
  Button,
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
import { getAllDiscountProducts } from "../service/productsDiscountService.js";
import { LuTreeDeciduous } from "react-icons/lu";

const CartProductsDiscount = () => {
  const bgColor = useColorModeValue("whiteAlpha.800", "blackAlpha.800"); // Background overlay color
  const textColor = useColorModeValue("black", "white"); // Text color
  const hoverBg = useColorModeValue("blue.50", "blue.600");
  const borderColor = useColorModeValue("blue.500", "blue.300");
  const user = useRecoilValue(userAtom);
  const [favoriteProducts, setFavoriteProducts] = useRecoilState(favoritesAtom);
  const [favoritesCount, setFavoritesCount] =
    useRecoilState(favoritesCountAtom);

  const [productsDiscounts, setProductsDiscounts] = useState([]);
  const fetchProductsDiscount = async () => {
    try {
      const products = await getAllDiscountProducts();
      setProductsDiscounts(products);
      console.log(products);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
    }
  };

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

  useEffect(() => {
    fetchFavorites();
    fetchProductsDiscount();
  }, []); // Dependency on user

  const isFavorite = (productId) =>
    favoriteProducts.some((fav) => fav._id === productId);

  //Hàm sử lý
  const handleAddToCart = async (productId) => {
    if (!user?._id) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    try {
      const product = productsDiscounts.find((prod) => prod._id === productId);
      if (!product || product.quantity <= 0) {
        toast.error("Sản phẩm này đã hết hàng!");
        return;
      }
      const quantity = 1;
      await addToCart(user._id, productId, quantity);
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
    <Box bg={useColorModeValue("green.50", "gray.900")}>
      {" "}
      <Container maxWidth="1200px" mx="auto" my="auto" p={{ base: 5, md: 10 }}>
        <Text
          fontSize={"18px"}
          textAlign={"center"}
          fontWeight={"bold"}
          mb={"40px"}
        >
          TOP SẢN PHẨM KHUYẾN MÃI (%)
        </Text>
        <SimpleGrid columns={[1, 2, 3]} spacing="15px">
          {productsDiscounts.slice(0, 6).map((productsDiscount, index) => {
            return (
              <Box
                borderRadius={"10px"}
                bg={"white"}
                position="relative"
                key={index}
                _hover={{ ".overlay": { opacity: 1 } }}
              >
                {/* Nhãn dán khuyến mãi */}
                {productsDiscount?.discount > 0 && (
                  <Box
                    position="absolute"
                    top="5px"
                    left="5px"
                    backgroundColor="white"
                    borderRadius="full"
                    borderWidth="2px"
                    borderColor="red.400"
                    fontWeight={"bold"}
                    px="3"
                    py="1"
                    zIndex="1"
                    textAlign="center"
                    fontSize="sm"
                    color="red.500"
                    as="i"
                  >
                    - {productsDiscount?.discount}%
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
                      onClick={() => handleAddToCart(productsDiscount._id)}
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
                      onClick={() => handleFavoriteToggle(productsDiscount._id)}
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
                      color={
                        isFavorite(productsDiscount._id) ? "red.500" : "black"
                      }
                    />
                  </Tooltip>
                  <NavLink to={`/${productsDiscount?.productName}`}>
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
                <NavLink to={`/${productsDiscount?.productName}`}>
                  <Box
                    borderWidth="1px"
                    shadow="md"
                    rounded="lg"
                    overflow="hidden"
                    position="relative"
                  >
                    <Image
                      src={`http://localhost:2000/images/${productsDiscount.image[0]}`}
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
                          color={"black"}
                        >
                          {productsDiscount?.productName}
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
                              color={"black"}
                            >
                              Giá:
                            </Text>
                            {productsDiscount.finalPrice !==
                              productsDiscount.originalPrice && (
                              <>
                                <Badge
                                  bg={"gray.300"}
                                  rounded="full"
                                  px="3"
                                  fontSize="sm"
                                  textDecoration="line-through"
                                  color="black"
                                >
                                  {productsDiscount.originalPrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                  Đ
                                </Badge>
                                <Badge
                                  color={"red"}
                                  rounded="full"
                                  px="3"
                                  mx="1"
                                  fontSize="sm"
                                  bg={"gray.300"}
                                >
                                  {productsDiscount.finalPrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                  Đ
                                </Badge>
                              </>
                            )}
                            {/* Nếu không có finalPrice, chỉ hiển thị originalPrice */}
                            {productsDiscount.finalPrice ===
                              productsDiscount.originalPrice && (
                              <Badge
                                color="black"
                                rounded="full"
                                px="3"
                                fontSize="sm"
                                bg={"gray.300"}
                              >
                                {productsDiscount.originalPrice.toLocaleString(
                                  "vi-VN"
                                )}
                                Đ
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
                          <Badge rounded="full" px="2" bg="gray.300">
                            <Text color={"black"}>
                              Màu sắc: {productsDiscount?.color?.nameColor}
                            </Text>
                          </Badge>
                          <Badge rounded="full" px="2" bg="gray.300">
                            <Text color={"black"}>
                              {" "}
                              Đánh giá: {productsDiscount?.ratingsCount}
                            </Text>
                          </Badge>
                          <Badge rounded="full" px="2" bg="gray.300">
                            <Text color={"black"}>
                              Bán: {productsDiscount?.orderCount}
                            </Text>
                          </Badge>
                        </Box>
                      </Box>

                      <Text
                        mt="1"
                        fontWeight="semibold"
                        noOfLines={3}
                        lineHeight="tight"
                        fontSize="sm"
                        color={"gray.600"}
                      >
                        {productsDiscount?.description}
                      </Text>
                    </Box>
                  </Box>
                </NavLink>
              </Box>
            );
          })}
        </SimpleGrid>
        <Box mt={"30px"} textAlign="center">
          <NavLink to={"/products"}>
            {" "}
            <Button
              px={"50px"}
              borderRadius={"none"}
              color={"black"}
              bg={useColorModeValue("gray.100", "green.50")}
              mx="auto"
              fontWeight="300" // Giảm độ đậm của chữ
            >
              Tất cả sản phẩm
            </Button>
          </NavLink>
        </Box>
      </Container>
    </Box>
  );
};

export default CartProductsDiscount;
