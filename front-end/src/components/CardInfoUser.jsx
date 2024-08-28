import React, { useEffect, useState } from "react";
import {
  Container,
  Text,
  Stack,
  Avatar,
  Icon,
  Box,
  Button,
  useColorModeValue,
  useDisclosure,
  Spinner,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { ImQuotesLeft } from "react-icons/im";
//components
import ModalInfoUser from "./ModalInfoUser";
//data Atom
import userAtom from "../Atom/userAtom.js";
//thư viện
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import axios from "axios";

const CardInfoUser = () => {
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

  //API
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

  const getRole = (role) => {
    return role ? "Admin" : "Khách hàng";
  };
  return (
    <Box bg={useColorModeValue("white", "black")}>
      <Container maxW="6xl" p={{ base: 3, md: 8 }}>
        {loading ? (
          <Flex justify="center" align="center" height="100vh">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: 0, sm: 10 }}
            p={{ base: 2, sm: 5 }}
            rounded="lg"
            justifyContent="center"
          >
            <Box
              width="10rem"
              pos="relative"
              display={{ base: "none", sm: "flex" }}
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                size="2xl"
                showBorder={true}
                borderColor="green.400"
                name={user?.username || "avatar"}
                src={`http://localhost:2000/images/${user?.avatar?.replace(
                  "uploads\\",
                  ""
                )}`}
              />
            </Box>

            <Stack direction="column" spacing={4} textAlign="left" maxW="4xl">
              <Icon as={ImQuotesLeft} w={10} h={10} color="white" />
              <Stack
                alignItems={{ base: "center", sm: "flex-start" }}
                spacing={0}
              >
                <Avatar
                  size="xl"
                  showBorder={true}
                  borderColor="green.400"
                  name={user?.username || "avatar"}
                  display={{ base: "block", sm: "none" }}
                />
                <Text fontWeight="bold" fontSize="lg" paddingBottom={3}>
                  Tên người dùng: {user?.username || "Chưa có dữ liệu"}
                </Text>
                <Divider />
                <Text fontWeight="medium" fontSize="md" paddingBottom={1}>
                  Email: {user?.email || "Chưa có dữ liệu"}
                </Text>
                <Divider />
                <Text fontWeight="medium" fontSize="md" paddingBottom={1}>
                  Địa chỉ: {user?.ward || "chưa có dữ liệu"},
                  {user?.district || "chưa có dữ liệu"},
                  {user?.city || "chưa có dữ liệu"}
                </Text>
                <Divider />
                <Text fontWeight="medium" fontSize="md" paddingBottom={1}>
                  Số điện thoại: {user?.numberPhone || "Chưa có dữ liệu"}
                </Text>
                <Divider />
                <Text fontWeight="medium" fontSize="md" paddingBottom={1}>
                  Vai trò: {getRole(user?.role) || "Chưa có dữ liệu"}
                </Text>
                <Box paddingTop={2}>
                  <Button onClick={() => OpenModal()}>
                    <Text
                      padding={{ base: 2, sm: 4, md: 6 }}
                      fontSize={{ base: "sm", md: "md" }}
                      width={{ base: "full", sm: "auto" }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                    >
                      Chỉnh sửa
                    </Text>
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        )}
        <ModalInfoUser user={user} isOpen={isOpen} onClose={onClose} />
      </Container>
    </Box>
  );
};

export default CardInfoUser;
