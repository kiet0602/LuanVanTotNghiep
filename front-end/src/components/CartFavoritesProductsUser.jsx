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
import { FaEye, FaShoppingCart, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
// Services
import { addToCart } from "../service/cartService.js";
// Atom
import userTokenAtom from "../Atom/userAtom.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesAtom, favoritesCountAtom } from "../Atom/favoritesAtom.js";
import {
  getAllFavoriteProducts,
  removeFavoriteProduct,
} from "../service/favoritesService.js";

const CartFavoritesProductsUser = () => {
  const bgColor = useColorModeValue("whiteAlpha.800", "blackAlpha.800");
  const hoverBg = useColorModeValue("blue.50", "blue.600");
  const borderColor = useColorModeValue("blue.500", "blue.300");
  // Atom
  const [favoriteProducts, setFavoriteProducts] = useRecoilState(favoritesAtom);
  const [favoritesCount, setFavoritesCount] =
    useRecoilState(favoritesCountAtom);

  const token = useRecoilValue(userTokenAtom);
  //Dữ liệu lấy từ back-end
  const [favoriteProductofUser, setFavoriteProductofUser] = useState([]);
  //Thêm giỏ hàng
  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    try {
      const product = favoriteProducts.find((prod) => prod._id === productId);
      if (!product || product.quantity <= 0) {
        toast.error("Sản phẩm này đã hết hàng!");
        return;
      }
      const quantity = 1;
      await addToCart(productId, quantity);
      toast.success("Sản phẩm đã thêm vào giỏ hàng");
    } catch (error) {
      toast.error("Lỗi thêm sản phẩm!");
    }
  };
  //Xóa thích sản phẩm
  const handleRemoveFavorite = async (productId) => {
    if (!token) {
      toast.error("Bạn cần đăng nhập để bỏ yêu thích sản phẩm");
      return;
    }
    try {
      await removeFavoriteProduct(productId);
      toast.success("Đã bỏ thích sản phẩm");
      setFavoriteProductofUser((prevFavorites) =>
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

  //Lấy sản phẩm từ back-end
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;
      try {
        const favorites = await getAllFavoriteProducts();
        setFavoriteProducts(favorites);
        setFavoritesCount(favorites.length);

        setFavoriteProductofUser(favorites);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
      }
    };
    fetchFavorites();
  }, []);

  const isFavorite = (productId) =>
    favoriteProductofUser.some((fav) => fav._id === productId);

  return (
    <>
      <Box bg={useColorModeValue("green.100", "gray.800")}>
        {" "}
        <Container maxWidth="1200px" mx="auto" my="auto" p={{ base: 5, md: 8 }}>
          {favoriteProductofUser.length > 0 ? (
            <SimpleGrid columns={[1, 2, 3]} spacing="15px">
              {favoriteProductofUser?.map((favoriteProduct) => (
                <Box
                  borderRadius={"10px"}
                  bg={"white"}
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
                      fontWeight={"bold"}
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
                        onClick={() => handleAddToCart(favoriteProduct?._id)}
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
                        onClick={() =>
                          handleFavoriteToggle(favoriteProduct?._id)
                        }
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
                    <NavLink to={`/products/${favoriteProduct?.productName}`}>
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

                  <NavLink to={`/products/${favoriteProduct?.productName}`}>
                    <Box rounded="lg" overflow="hidden" position="relative">
                      <Image
                        src={`http://localhost:2000/images/${favoriteProduct?.image[0]}`}
                        alt="Product image"
                      />
                      <Box p={{ base: 4, lg: 6 }}>
                        <Box
                          d="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Box
                            fontWeight="semibold"
                            as="h2"
                            letterSpacing="wide"
                            textTransform="uppercase"
                            ml="2"
                            textAlign="center"
                            color={"black"}
                          >
                            {favoriteProduct?.productName.length > 20
                              ? `${favoriteProduct?.productName.substring(
                                  0,
                                  25
                                )}...`
                              : favoriteProduct?.productName}
                          </Box>
                        </Box>
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
                            {favoriteProduct?.finalPrice !==
                              favoriteProduct?.originalPrice && (
                              <>
                                <Badge
                                  bg={"gray.300"}
                                  rounded="full"
                                  px="3"
                                  fontSize="sm"
                                  textDecoration="line-through"
                                  color="black"
                                >
                                  {favoriteProduct?.originalPrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                  Đ
                                </Badge>
                                <Badge
                                  bg={"gray.300"}
                                  rounded="full"
                                  px="3"
                                  mx="1"
                                  fontSize="sm"
                                  color="red"
                                >
                                  {favoriteProduct?.finalPrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                  Đ
                                </Badge>
                              </>
                            )}
                            {/* Nếu không có finalPrice, chỉ hiển thị originalPrice */}
                            {favoriteProduct?.finalPrice ===
                              favoriteProduct?.originalPrice && (
                              <Badge
                                rounded="full"
                                bg={"gray.300"}
                                color="black"
                                px="3"
                                fontSize="sm"
                              >
                                {favoriteProduct?.originalPrice.toLocaleString(
                                  "vi-VN"
                                )}
                                Đ
                              </Badge>
                            )}
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
                          <Badge rounded="full" px="2" bg="gray.300">
                            <Text color={"black"}>
                              Màu sắc: {favoriteProduct?.color?.nameColor}
                            </Text>
                          </Badge>

                          <Badge rounded="full" px="2" bg="gray.300">
                            <Text color={"black"}>
                              {" "}
                              Đánh giá: {favoriteProduct?.ratingsCount}
                            </Text>
                          </Badge>

                          <Badge rounded="full" px="2" bg="gray.300">
                            <Text color={"black"}>
                              Bán: {favoriteProduct?.orderCount}
                            </Text>
                          </Badge>
                        </Box>
                        <Text
                          mt="1"
                          fontWeight="semibold"
                          noOfLines={3}
                          lineHeight="tight"
                          fontSize="sm"
                          color={"gray.600"}
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
        </Container>
      </Box>
    </>
  );
};

export default CartFavoritesProductsUser;
