import React, { useEffect, useState } from "react";

import {
  Container,
  Box,
  Heading,
  Text,
  Flex,
  useColorModeValue,
  useDisclosure,
  Spinner,
  Avatar,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { FaHeadphones, FaGlobe, FaStar, FaHome } from "react-icons/fa"; // Sử dụng react-icons thay vì SVG tự định nghĩa

import { ImQuotesLeft } from "react-icons/im";
//components
import ModalInfoUser from "./ModalInfoUser";
//data Atom
import userAtom from "../Atom/userAtom.js";
//thư viện
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import axios from "axios";
import {
  faLocationDot,
  faPen,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumbss from "./Breadcrumbss.jsx";

const CartinfoUser = () => {
  //khai báo
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //data Atom
  const userData = localStorage.getItem("userCurrent");
  const userCurrent = userData ? JSON.parse(userData) : null;
  // const userCurrent = useRecoilValue(userAtom);
  const userId = userCurrent?._id;

  //handle
  const OpenModal = () => {
    onOpen();
  };
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/user/getUser/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.log(error.message);
        toast.error("Không thể lấy dữ liệu người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  console.log(user);
  const getRole = (role) => {
    return role ? "Admin" : "Khách hàng";
  };

  const hasAllData = user?.ward && user?.district && user?.city;

  return (
    <Container maxW={"7xl"} px={{ base: 5, md: 10 }}>
      <Breadcrumbss />
      {loading ? (
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Box
          maxW="64rem"
          marginX="auto"
          py={{ base: "3rem", md: "4rem" }}
          px={{ base: "1rem", md: "0" }}
        >
          <Heading
            as="h3"
            fontSize="1.5rem"
            fontWeight="bold"
            textAlign="left"
            mb={{ base: "4", md: "2" }}
            pb={4}
            borderBottom="1px solid"
            borderColor="gray.300"
          >
            <Box display={"flex"} gap={3} alignItems={"center"}>
              <Text> {user?.username}</Text>{" "}
              <Avatar
                size="sm"
                src={`http://localhost:2000/images/${user?.avatar}`}
              />
              <Tooltip label="Cập nhật thông tin" hasArrow arrowSize={15}>
                <FontAwesomeIcon
                  onClick={() => OpenModal()}
                  cursor={"pointer"}
                  icon={faPen}
                  size="sm"
                />
              </Tooltip>
            </Box>
          </Heading>

          <Flex
            as="section"
            alignItems="start"
            justifyContent="between"
            flexDirection={{ base: "column", md: "row" }}
            my={{ base: "1.5rem", md: "2.5rem" }}
            borderBottom="1px solid"
            borderColor="gray.300"
            pb={8}
          >
            {/* Feature 1 */}
            <Box
              w={{ base: "100%", md: "1/3" }}
              px={{ md: "0.5rem" }}
              mb={{ base: "6", md: "0" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={3}
              >
                <FontAwesomeIcon size="2xl" icon={faPhone} />
              </Box>
              <Text textAlign="left" fontWeight="700" mt={3} mb={1}>
                <Text>Địa chỉ Email : {user?.email}</Text>
                <Text>Số điện thoại : {user?.numberPhone}</Text>
              </Text>
              <Text
                color={useColorModeValue("gray.700", "gray.400")}
                fontSize="0.875rem"
                fontWeight="300"
                textAlign="left"
                mt={3}
                mb={1}
              >
                Địa chỉ Email và số điện thoại là hai trường không lặp lại, được
                hiểu như của mỗi người là khác nhau.
              </Text>
            </Box>

            {/* Feature 2 */}
            <Box
              w={{ base: "100%", md: "1/3" }}
              px={{ md: "0.5rem" }}
              mb={{ base: "6", md: "0" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={3}
              >
                <FontAwesomeIcon icon={faLocationDot} size="2xl" />
              </Box>
              <Text textAlign="left" fontWeight="700" mt={3} mb={1}>
                {hasAllData
                  ? `Địa chỉ giao hàng : ${user.ward}, ${user.district}, ${user.city}`
                  : "Không có dữ liệu"}
              </Text>
              <Text
                color={useColorModeValue("gray.700", "gray.400")}
                fontSize="0.875rem"
                fontWeight="300"
                textAlign="left"
                mt={3}
                mb={1}
              >
                Là nơi khách hàng khai báo để có thể vận chuyển sản phẩm đến
                giao.
              </Text>
            </Box>

            {/* Feature 3 */}
            <Box
              w={{ base: "100%", md: "1/3" }}
              px={{ md: "0.5rem" }}
              mb={{ base: "6", md: "0" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={3}
              >
                <FontAwesomeIcon icon={faUser} size="2xl" />
              </Box>
              <Text textAlign="left" fontWeight="700" mt={3} mb={1}>
                Vai trò của bạn : {getRole(user?.role) || "Chưa có dữ liệu"}
              </Text>
              <Text
                color={useColorModeValue("gray.700", "gray.400")}
                fontSize="0.875rem"
                fontWeight="300"
                textAlign="left"
                mt={3}
                mb={1}
              >
                Khách hàng là người có tài khoảng và là người có thể sử dụng tất
                cả các dịch vụ của hệ thống cho phép.
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
      <ModalInfoUser user={user} isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default CartinfoUser;
