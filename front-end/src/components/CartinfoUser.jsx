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
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

import { IoLocationOutline, IoPhonePortraitOutline } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"; // Đảm bảo rằng bạn đã import faPen
import { CiPen, CiTrash, CiUser } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";

import ModalInfoUser from "./ModalInfoUser";
import Breadcrumbss from "./Breadcrumbss.jsx";
import AddAddressModel from "./AddAddressModel.jsx";

import { toast } from "react-toastify";
import axios from "axios";

const CartinfoUser = () => {
  //khai báo

  const userData = localStorage.getItem("userCurrent");
  const userCurrent = userData ? JSON.parse(userData) : null;
  const userId = userCurrent?._id;

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

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
  //handle
  //Xóa địa chỉ
  const handleDeleteAddress = async (addressId) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa địa chỉ này không?"
    );

    if (!isConfirmed) {
      return; // Nếu người dùng không xác nhận, thoát ra
    }

    try {
      // Gọi API để lấy địa chỉ mặc định, có thể trả về 404 nếu không có
      let defaultAddress = null;
      try {
        const response = await axios.get(
          `http://localhost:2000/api/address/addresses/default/${userId}`
        );
        defaultAddress = response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Nếu không có địa chỉ mặc định, bỏ qua kiểm tra
          defaultAddress = null;
        } else {
          // Nếu có lỗi khác, hiển thị lỗi
          throw error;
        }
      }

      // Kiểm tra nếu địa chỉ đang muốn xóa là địa chỉ mặc định
      if (defaultAddress && defaultAddress._id === addressId) {
        toast.error(
          "Vui lòng chọn địa chỉ khác làm mặc định trước khi xóa địa chỉ này"
        );
        return;
      }

      // Xóa địa chỉ
      await axios.delete(
        `http://localhost:2000/api/address/addresses/${addressId}`
      );

      // Cập nhật danh sách địa chỉ
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));

      // Hiển thị thông báo xóa thành công
      toast.success("Đã xóa thành công địa chỉ");
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi xóa địa chỉ");
    }
  };

  //Cập nhật danh sách địa chỉ
  const handelAddAddress = async (newAddress) => {
    try {
      setAddresses((prev) => [...prev, newAddress]);
    } catch (error) {
      console.error("Failed to add color:", error);
    }
  };
  //Lấy dữ liệu người dùng
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
  //Lấy dữ liệu Địa chỉ
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
  //Cập nhật địa chỉ mặc định
  const UpdateAddress = async () => {
    if (!selectedAddress) {
      toast.warn("Vui lòng chọn địa chỉ để cập nhật.");
      return;
    }

    const currentAddress = addresses.find(
      (addr) => addr._id === selectedAddress
    );

    // Kiểm tra xem địa chỉ đang cập nhật có phải là địa chỉ mặc định không
    if (currentAddress.isDefault) {
      toast.warn("Địa chỉ này đang là mặc định, không cần cập nhật.");
      return;
    }

    const updatedAddress = {
      // Cập nhật thông tin địa chỉ nếu cần
      street: currentAddress?.street,
      ward: currentAddress?.ward,
      district: currentAddress?.district,
      province: currentAddress?.province,
      isDefault: true, // Đặt địa chỉ này thành mặc định
    };

    try {
      await axios.put(
        `http://localhost:2000/api/address/addresses/${selectedAddress}`,
        updatedAddress
      );

      // Nếu địa chỉ được cập nhật không phải là mặc định, cập nhật địa chỉ khác
      const otherAddresses = addresses.filter(
        (addr) => addr._id !== selectedAddress
      );
      if (otherAddresses.some((addr) => addr.isDefault)) {
        // Nếu có địa chỉ khác đã được đặt làm mặc định, không cần làm gì thêm
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        // Nếu không có địa chỉ nào khác là mặc định, chuyển địa chỉ này thành mặc định
        toast.success("Cập nhật địa chỉ thành công và đã đặt làm mặc định!");
      }

      fetchAddresses(); // Tải lại danh sách địa chỉ sau khi cập nhật
    } catch (error) {
      console.log(error.message);
      toast.error("Cập nhật địa chỉ thất bại.");
    }
  };

  const handleAddressChange = (value) => {
    setSelectedAddress(value);
  };

  const getRole = (role) => {
    return role ? "Admin" : "Khách hàng";
  };
  const hasAllData = addresses.length > 0;

  useEffect(() => {
    if (!userId) return;
    fetchUser();
    fetchAddresses();
  }, [userId]);
  return (
    <>
      {" "}
      <Box bg={useColorModeValue("green.100", "gray.800")}>
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
                borderColor="gray.300"
              >
                <Box display={"flex"} gap={3} alignItems={"center"}>
                  <Text color={useColorModeValue("green.800", "green.200")}>
                    {user?.username}
                  </Text>{" "}
                  <Avatar
                    size="sm"
                    src={`http://localhost:2000/images/${user?.avatar}`}
                  />
                  <CiPen
                    color={useColorModeValue("black", "white")}
                    onClick={onOpenUserModal}
                    cursor={"pointer"}
                    size="40px"
                  />
                </Box>
              </Heading>

              <Flex
                bg={"white"}
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
                    <AiOutlineMail
                      color={useColorModeValue("gray.500", "black")}
                      style={{ marginRight: "8px" }}
                    />
                    {/* Icon Email */}
                    <Text fontWeight="700" color={"red.600"}>
                      {user?.email}
                    </Text>
                  </Flex>
                  <Text color={useColorModeValue("gray.500", "black")}>
                    Địa chỉ email của bạn
                  </Text>
                </Box>

                <Box
                  w={{ base: "100%", md: "30%" }} // Chia đều không gian 3 phần
                  px={{ md: "0.5rem" }}
                  mb={{ base: "6", md: "0" }}
                >
                  <Flex alignItems="center">
                    <IoPhonePortraitOutline
                      color={useColorModeValue("gray.500", "black")}
                      style={{ marginRight: "8px" }}
                    />{" "}
                    {/* Icon Số điện thoại */}
                    <Text fontWeight="700" color={"red.600"}>
                      {user?.numberPhone}
                    </Text>
                  </Flex>
                  <Text color={useColorModeValue("gray.500", "black")}>
                    Số điện thoại của bạn
                  </Text>
                </Box>

                <Box
                  w={{ base: "100%", md: "30%" }} // Chia đều không gian 3 phần
                  px={{ md: "0.5rem" }}
                  mb={{ base: "6", md: "0" }}
                >
                  <Flex alignItems="center">
                    <CiUser
                      color={useColorModeValue("gray.500", "black")}
                      style={{ marginRight: "8px" }}
                    />
                    {/* Icon Vai trò */}
                    <Text fontWeight="700" color={"red.600"}>
                      {getRole(user?.role) || "Chưa có dữ liệu"}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="sm"
                    color={useColorModeValue("gray.500", "black")}
                  >
                    Vai trò của bạn trong hệ thống
                  </Text>
                </Box>
              </Flex>

              <Box>
                <Flex alignItems="center" justifyContent="space-between" mb={4}>
                  <Heading as="h4" fontSize="1.2rem">
                    Danh sách địa chỉ
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Lưu ý: Vui lòng chọn địa chỉ{" "}
                    <Text as="span" fontWeight="bold">
                      mặc định
                    </Text>{" "}
                    để chúng tôi có thể giao đến địa chỉ bạn đã chọn.
                  </Text>
                </Flex>
                <Box
                  borderRadius="xl"
                  boxShadow="md"
                  p={4}
                  bg={useColorModeValue("white", "gray.100")}
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
                          borderRadius="full"
                          boxShadow="lg"
                          border={"1px ridge"}
                          p={3}
                          bg={
                            address.isDefault
                              ? useColorModeValue("green.100", "white") // Màu khác cho chế độ sáng và tối nếu là mặc định
                              : useColorModeValue("white", "green.200") //
                          }
                          position="relative"
                        >
                          <Radio
                            value={address._id}
                            isChecked={selectedAddress === address._id}
                            colorScheme={useColorModeValue(
                              address.isDefault ? "green" : "red", // Màu cho chế độ sáng
                              address.isDefault ? "red" : "white" // Màu cho chế độ tối
                            )}
                          >
                            <Text>
                              <Flex alignItems="center" justifyContent="center">
                                <IoLocationOutline
                                  color="black"
                                  style={{ marginRight: "8px" }}
                                />{" "}
                                {/* Thêm khoảng cách giữa biểu tượng và văn bản */}
                                <Text color="black" pr="20px">
                                  Địa chỉ giao hàng:
                                </Text>
                                <Box
                                  color="red.700"
                                  as="span"
                                  fontWeight="bold"
                                  pr="5px"
                                >
                                  Đường:
                                </Box>
                                <Box
                                  color={useColorModeValue("gray.600", "black")}
                                  as="span"
                                  fontWeight="normal"
                                  pr="20px"
                                >
                                  {address.street}
                                </Box>
                                <Box
                                  color="red.700"
                                  as="span"
                                  fontWeight="bold"
                                  pr="5px"
                                >
                                  Xã:
                                </Box>
                                <Box
                                  as="span"
                                  fontWeight="normal"
                                  color={useColorModeValue("gray.600", "black")}
                                  pr="20px"
                                >
                                  {address.ward}
                                </Box>
                                <Box
                                  color="red.700"
                                  as="span"
                                  fontWeight="bold"
                                  pr="5px"
                                >
                                  Quận/Huyện:
                                </Box>
                                <Box
                                  as="span"
                                  fontWeight="normal"
                                  pr="20px"
                                  color={useColorModeValue("gray.600", "black")}
                                >
                                  {address.district}
                                </Box>
                                <Box
                                  color="red.700"
                                  as="span"
                                  fontWeight="bold"
                                  pr="5px"
                                >
                                  Tỉnh:
                                </Box>
                                <Box
                                  as="span"
                                  fontWeight="normal"
                                  pr="20px"
                                  color={useColorModeValue("gray.600", "black")}
                                >
                                  {address.province}
                                </Box>
                              </Flex>
                            </Text>
                          </Radio>
                          <Box
                            position="absolute"
                            top="50%"
                            right="10px"
                            transform="translateY(-50%)"
                            onClick={(e) => handleDeleteAddress(address._id)}
                          >
                            <Box
                              as="button"
                              borderRadius="full" // Làm cho nền hình tròn
                              p="2" // Khoảng cách xung quanh biểu tượng
                              cursor="pointer"
                              _hover={{ bg: "gray.300" }} // Màu nền khi hover
                            >
                              <CiTrash
                                color={useColorModeValue("gray.600", "black")}
                                size="25px"
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Text>Bạn chưa có địa chỉ giao hàng</Text>
                    )}
                  </RadioGroup>
                  <UnorderedList color={useColorModeValue("red.900", "black")}>
                    <ListItem>Bước 1: Chọn địa chỉ</ListItem>
                    <ListItem>Bước 2: Nhấn nút đặt địa chỉ</ListItem>
                    <ListItem>
                      Mặc định: Xanh nhạt(nền sáng), Trắng nhạt(nền tối){" "}
                    </ListItem>{" "}
                  </UnorderedList>
                </Box>

                {setSelectedAddress && hasAllData && (
                  <Button
                    px="50px"
                    borderRadius="none"
                    bg="white"
                    color="black"
                    fontWeight="300"
                    boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
                    onClick={UpdateAddress}
                    mt={4}
                  >
                    Đặt địa chỉ mặc định
                  </Button>
                )}
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
                  <Text ml={2} color="black" fontWeight="bold">
                    Thêm địa chỉ mới
                  </Text>
                </Box>
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
      </Box>
    </>
  );
};

export default CartinfoUser;
