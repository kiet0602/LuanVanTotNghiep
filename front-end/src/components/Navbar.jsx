import {
  Box,
  Flex,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Icon,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Spinner,
  Image,
} from "@chakra-ui/react";

import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { CiHeart, CiShoppingCart } from "react-icons/ci";

// Thư viện
import { NavLink } from "react-router-dom";
// Components

import AvatarUser from "./AvatarUser";
// Data
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import { navLinks, dropdownLinks } from "../assets/data/datalink/datalink.js";

// Hook custom
import useNavigateCustom from "../Hook/useNavigateCustom.js";
import Search from "./Search.jsx";
import Fillter from "./Fillter.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userTokenAtom from "../Atom/userAtom.js";
import { cartItemProductsAtom } from "../Atom/cartCountProductAtom.js";

const Navbar = () => {
  // Use React
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  // Use Custom Hook
  const { goHome, goLogin } = useNavigateCustom();
  // Lấy dữ liệu từ localStorage

  const [userCurrent, setuserCurrent] = useState(null);

  const token = useRecoilValue(userTokenAtom);
  const cartItemProducts = useRecoilValue(cartItemProductsAtom);

  const fetchUser = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:2000/api/user/getUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      setuserCurrent(response.data);
    } catch (error) {
      console.log(error.message);
      // toast.error("Không thể lấy dữ liệu người dùng."); // Uncomment if you have a toast function
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUser();
  }, []);

  const favoritesCount = localStorage.getItem("favoritesCount");
  const favorites = favoritesCount ? JSON.parse(favoritesCount) : 0;
  // Style
  // Lấy giá trị cartCount từ localStorage
  // const cartCount = useRecoilValue(cartItemProductsAtom);
  // console.log(cartCount);

  // Sử dụng cartCount trong component hoặc logic của bạn
  const cartCount = cartItemProducts;

  return (
    <Box
      pr={4}
      bg={useColorModeValue("white", "black")}
      position="sticky"
      top={0}
      zIndex={10}
      width={"200"}
    >
      <Flex alignItems="center" justifyContent="space-between" mx="auto">
        <Flex
          gap={1}
          alignItems="center" // Căn giữa nội dung theo chiều dọc
          justifyContent="center" // Căn giữa nội dung theo chiều ngang
          p="4"
          pl={10}
          onClick={goHome}
          cursor={"pointer"}
        >
          <Image borderRadius={"20px"} src={imgSenda} alt="" h={8} w={8} />
          <Text
            fontFamily="'Allura', cursive"
            pr={10}
            pt={2}
            fontWeight="bold"
            fontSize={"30px"} // Thêm 'px' để xác định đơn vị
            color={useColorModeValue("green.800", "green.200")}
          >
            Plant Paradise
          </Text>
        </Flex>

        <HStack spacing={8} alignItems="center">
          <HStack
            as="nav"
            spacing={6}
            display={{ base: "none", md: "flex" }}
            alignItems="center"
          >
            {navLinks.map((link, index) => (
              <CustomNavLink key={index} name={link.name} path={link.path} />
            ))}

            <Menu autoSelect={false} isLazy>
              {({ isOpen, onClose }) => (
                <>
                  <MenuButton
                    _hover={{ color: "white.400" }}
                    textDecoration="none"
                  >
                    <Flex alignItems="center">
                      <Text
                        fontFamily="'Quicksand', sans-serif"
                        fontWeight="bold"
                        textTransform="uppercase"
                        _hover={{
                          color: "blue.200",
                        }}
                      >
                        Sản phẩm
                      </Text>
                      <Icon
                        as={BiChevronDown}
                        h={5}
                        w={5}
                        ml={1}
                        transition="all .25s ease-in-out"
                        transform={isOpen ? "rotate(180deg)" : ""}
                      />
                    </Flex>
                  </MenuButton>
                  <Flex alignItems="center" cursor={"pointer"}>
                    <Fillter />
                  </Flex>
                  <MenuList
                    zIndex={5}
                    bg={useColorModeValue(
                      "rgb(255, 255, 255)",
                      "rgb(26, 32, 44)"
                    )}
                    border="none"
                    boxShadow={useColorModeValue(
                      "2px 4px 6px 2px rgba(160, 174, 192, 0.6)",
                      "2px 4px 6px 2px rgba(9, 17, 28, 0.6)"
                    )}
                  >
                    {dropdownLinks.map((link, index) => (
                      <MenuLink
                        key={index}
                        name={link.name}
                        path={link.path}
                        onClose={onClose}
                      />
                    ))}
                  </MenuList>
                </>
              )}
            </Menu>
          </HStack>
        </HStack>
        <Flex alignItems="center" gap={3} wrap="nowrap">
          <Search />
          <Box display="flex" alignItems="center" gap={2}>
            {loading ? (
              <Spinner color="green.500" size="md" />
            ) : userCurrent ? (
              <Flex
                alignItems="center"
                bg={useColorModeValue("black", "white")}
                borderRadius="full"
                pl="1"
              >
                <AvatarUser userCurrent={userCurrent} />
                <Text
                  fontFamily="'Playfair Display', serif"
                  color={useColorModeValue("black", "white")}
                  fontWeight="bold"
                  fontSize="15px"
                  display="inline-block"
                  whiteSpace="nowrap"
                  bg={useColorModeValue("green.100", "green.800")}
                  borderRadius="full"
                  p="2"
                  cursor="pointer"
                  ml={2}
                >
                  <NavLink to="/profileUser">{userCurrent?.username}</NavLink>
                </Text>
              </Flex>
            ) : (
              <Flex
                alignItems="center"
                backgroundColor="green.200"
                borderRadius="full"
                pl="1"
              >
                <Text
                  fontFamily="'Playfair Display', serif"
                  fontWeight="bold"
                  fontSize="15px"
                  display="inline-block"
                  whiteSpace="nowrap"
                  backgroundColor="green.200"
                  borderRadius="full"
                  p="2"
                  cursor="pointer"
                  onClick={goLogin}
                >
                  ĐĂNG NHẬP
                </Text>
              </Flex>
            )}
          </Box>

          <NavLink to={"/cart"}>
            <Box position="relative" display="inline-block">
              <CiShoppingCart
                justifyContent="center" // Căn giữa theo chiều ngang
                alignItems="center" // Căn giữa theo chiều dọc
                size={"30px"}
                color={useColorModeValue("black", "white")}
              />
              <Box
                position="absolute"
                top="-1"
                right="-1"
                backgroundColor="red.500"
                color="white"
                fontSize="xs"
                borderRadius="full"
                width="16px"
                height="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {cartCount}
              </Box>
            </Box>
          </NavLink>
          <NavLink to={"/favirotesProduct"}>
            <Box position="relative" display="inline-block">
              <CiHeart
                color={useColorModeValue("black", "white")}
                justifyContent="center" // Căn giữa theo chiều ngang
                alignItems="center" // Căn giữa theo chiều dọc
                size={"30px"}
              />

              <Box
                position="absolute"
                top="-1"
                right="-1"
                backgroundColor="red.500"
                color="white"
                fontSize="xs"
                borderRadius="full"
                width="16px"
                height="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {favorites}
              </Box>
            </Box>
          </NavLink>
          <IconButton
            size="md"
            icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
            aria-label="Open Menu"
            display={{ base: "inherit", md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ base: "inherit", md: "none" }}>
          <Stack as="nav" spacing={2}>
            {navLinks.map((link, index) => (
              <CustomNavLink key={index} name={link.name} path={link.path} />
            ))}
            <Fillter />
            <Text
              fontFamily="'Quicksand', sans-serif"
              fontWeight="bold"
              textTransform="uppercase"
              _hover={{
                color: "blue.200",
              }}
            >
              Sản phẩm
            </Text>

            <Stack pl={2} spacing={1} mt={"0 !important"}>
              {dropdownLinks.map((link, index) => (
                <CustomNavLink key={index} name={link.name} path={link.path} />
              ))}
            </Stack>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

const CustomNavLink = ({ name, path }) => {
  // Colors for active and hover states
  const activeColor = useColorModeValue("blue.500", "blue.200");
  const hoverColor = useColorModeValue("blue.400", "blue.300");

  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        color: isActive ? activeColor : "inherit",
        textDecoration: "none",
      })}
    >
      <Text
        fontFamily="'Quicksand', sans-serif"
        fontWeight="bold"
        textTransform="uppercase" // Thêm thuộc tính này để hiển thị chữ hoa
        _hover={{
          color: hoverColor,
        }}
      >
        {name}
      </Text>
    </NavLink>
  );
};

const MenuLink = ({ name, path, onClose }) => {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        color: isActive ? "blue.400" : "inherit",
      })}
      onClick={onClose}
    >
      <MenuItem
        _hover={{
          color: "blue.400",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        <Text
          fontFamily="'Quicksand', sans-serif"
          fontWeight="bold"
          textTransform="uppercase"
        >
          {name}
        </Text>
      </MenuItem>
    </NavLink>
  );
};

export default Navbar;
