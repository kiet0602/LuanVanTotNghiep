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
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

import { FaUserEdit } from "react-icons/fa";
import ModalInfoUser from "./ModalInfoUser";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import axios from "axios";

import Breadcrumbss from "./Breadcrumbss.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEnvelope,
  faPen,
  faPhone,
  faPlusCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons"; // Đảm bảo rằng bạn đã import faPen
import AddAddressModel from "./AddAddressModel.jsx";

const CartinfoUser = () => {
  //khai báo
  const {
    isOpen: isOpenUserModal,
    onOpen: onOpenUserModal,
    onClose: onCloseUserModal,
  } = useDisclosure();
  const {
    isOpen: isOpenAddressModal,
    onOpen: onOpenAddressModal,
    onClose: onCloseAddressModal,
  } = useDisclosure();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const userData = localStorage.getItem("userCurrent");
  const userCurrent = userData ? JSON.parse(userData) : null;
  const userId = userCurrent?._id;

  //handle
  const OpenModal = () => {
    onOpen();
  };

  const handelAddAddress = async (newAddress) => {
    try {
      setAddresses((prev) => [...prev, newAddress]);
    } catch (error) {
      console.error("Failed to add color:", error);
    }
  };

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

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/address/addresses/${userId}`
      );
      setAddresses(response.data);
    } catch (error) {
      toast.error("Không thể lấy địa chỉ.");
    }
  };

  const UpdateAddress = async () => {
    if (!selectedAddress) {
      toast.warn("Vui lòng chọn địa chỉ để cập nhật.");
      return;
    }

    const updatedAddress = {
      // Bạn có thể cập nhật thêm thông tin ở đây nếu cần
      street: addresses.find((addr) => addr._id === selectedAddress)?.street,
      ward: addresses.find((addr) => addr._id === selectedAddress)?.ward,
      district: addresses.find((addr) => addr._id === selectedAddress)
        ?.district,
      province: addresses.find((addr) => addr._id === selectedAddress)
        ?.province,
      isDefault: true, // Đặt địa chỉ này thành mặc định
    };

    try {
      await axios.put(
        `http://localhost:2000/api/address/addresses/${selectedAddress}`,
        updatedAddress
      );
      toast.success("Cập nhật địa chỉ thành công!");
      fetchAddresses(); // Tải lại danh sách địa chỉ sau khi cập nhật
    } catch (error) {
      console.log(error.message);
      toast.error("Cập nhật địa chỉ thất bại.");
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchUser();
    fetchAddresses();
  }, [userId]);

  const handleAddressChange = (value) => {
    setSelectedAddress(value);
  };

  const getRole = (role) => {
    return role ? "Admin" : "Khách hàng";
  };

  const hasAllData = addresses.length > 0;

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
              <Text>{user?.username}</Text>{" "}
              <Avatar
                size="sm"
                src={`http://localhost:2000/images/${user?.avatar}`}
              />
              <Tooltip label="Cập nhật thông tin" hasArrow arrowSize={15}>
                <FontAwesomeIcon
                  onClick={onOpenUserModal}
                  cursor={"pointer"}
                  icon={faPen}
                  size="sm"
                  style={{ marginLeft: "8px" }} // Thêm khoảng cách giữa avatar và biểu tượng
                />
              </Tooltip>
            </Box>
          </Heading>

          <Flex
            as="section"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ base: "column", md: "row" }} // Hàng ngang trên màn hình lớn, dọc trên màn hình nhỏ
            my={{ base: "1.5rem", md: "2.5rem" }}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            boxShadow="md"
          >
            <Box
              w={{ base: "100%", md: "30%" }} // Chia đều không gian 3 phần
              px={{ md: "0.5rem" }}
              mb={{ base: "6", md: "0" }}
            >
              <Flex alignItems="center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ marginRight: "8px" }}
                />
                {/* Icon Email */}
                <Text fontWeight="700">{user?.email}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                Địa chỉ email của bạn
              </Text>
            </Box>

            <Box
              w={{ base: "100%", md: "30%" }} // Chia đều không gian 3 phần
              px={{ md: "0.5rem" }}
              mb={{ base: "6", md: "0" }}
            >
              <Flex alignItems="center">
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{ marginRight: "8px" }}
                />{" "}
                {/* Icon Số điện thoại */}
                <Text fontWeight="700">{user?.numberPhone}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                Số điện thoại của bạn
              </Text>
            </Box>

            <Box
              w={{ base: "100%", md: "30%" }} // Chia đều không gian 3 phần
              px={{ md: "0.5rem" }}
              mb={{ base: "6", md: "0" }}
            >
              <Flex alignItems="center">
                <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />
                {/* Icon Vai trò */}
                <Text fontWeight="700">
                  {getRole(user?.role) || "Chưa có dữ liệu"}
                </Text>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                Vai trò của bạn trong hệ thống
              </Text>
            </Box>
          </Flex>

          <Box>
            <Heading as="h4" fontSize="1.2rem" mb={4}>
              Danh sách địa chỉ
            </Heading>
            <Box
              borderRadius="md"
              border="1px"
              borderColor="gray.300"
              boxShadow="sm"
              p={4}
              bg="white"
              opacity={0.8}
            >
              <RadioGroup
                onChange={handleAddressChange}
                value={selectedAddress}
              >
                {hasAllData ? (
                  addresses.map((address) => (
                    <Box
                      key={address._id}
                      mb={4}
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="lg"
                      boxShadow="sm"
                      p={3}
                      bg="gray.50"
                      position="relative"
                    >
                      <Radio
                        value={address._id}
                        isChecked={address.isDefault}
                        colorScheme={address.isDefault ? "blue" : "teal"}
                      >
                        <Text
                          fontSize="sm" // Cập nhật kích thước chữ ở đây
                          color={address.isDefault ? "blue.600" : "teal.600"}
                        >
                          <span style={{ fontWeight: "normal" }}>Đường:</span>{" "}
                          <span
                            style={{ fontWeight: "bold", color: "teal.600" }}
                          >
                            {address.street}
                          </span>
                          , <span style={{ fontWeight: "normal" }}>Xã:</span>{" "}
                          <span
                            style={{ fontWeight: "bold", color: "teal.600" }}
                          >
                            {address.ward}
                          </span>
                          ,{" "}
                          <span style={{ fontWeight: "normal" }}>
                            Quận/Huyện:
                          </span>{" "}
                          <span
                            style={{ fontWeight: "bold", color: "teal.600" }}
                          >
                            {address.district}
                          </span>
                          , <span style={{ fontWeight: "normal" }}>Tỉnh:</span>{" "}
                          <span
                            style={{ fontWeight: "bold", color: "teal.600" }}
                          >
                            {address.province}
                          </span>
                        </Text>
                      </Radio>
                      <Box
                        position="absolute"
                        top="50%"
                        right="10px"
                        transform="translateY(-50%)"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          color="teal"
                          cursor="pointer"
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Text>Bạn chưa có địa chỉ giao hàng</Text>
                )}
              </RadioGroup>
            </Box>

            {/* Nút thêm địa chỉ mới */}
            <Box
              mt={4}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              boxShadow="sm"
              p={3}
              bg="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={onOpenAddressModal}
            >
              <FontAwesomeIcon icon={faPlusCircle} color="teal" size="lg" />
              <Text ml={2} color="teal.600" fontWeight="bold">
                Thêm địa chỉ mới
              </Text>
            </Box>

            {setSelectedAddress && hasAllData && (
              <Button onClick={UpdateAddress} colorScheme="teal" mt={4}>
                Đặt địa chỉ này thành mặc định
              </Button>
            )}
          </Box>
        </Box>
      )}
      <ModalInfoUser
        user={user}
        isOpen={isOpenUserModal}
        onClose={onCloseUserModal}
      />
      <AddAddressModel
        isOpen={isOpenAddressModal}
        onClose={onCloseAddressModal}
        onAdd={handelAddAddress}
      />
    </Container>
  );
};

export default CartinfoUser;
