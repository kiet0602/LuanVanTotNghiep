import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Container,
  Stack,
  VStack,
  FormControl,
  FormLabel,
  Select,
  useColorModeValue,
  Image,
  Flex,
  Box,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useRecoilState } from "recoil";
import userAtom from "../Atom/userAtom";
import { toast } from "react-toastify";

const AddAddressModel = ({ isOpen, onClose, onAdd }) => {
  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const userData = localStorage.getItem("userCurrent");
  const userCurrent = userData ? JSON.parse(userData) : null; // Chuyển đổi chuỗi JSON thành đối tượng
  const userId = userCurrent ? userCurrent._id : null; // Lấy _id từ đối tượng

  const handleUpdateUser = async () => {
    if (!street || !ward || !district || !province) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi lưu!");
      return;
    }
    try {
      const addAddress = {
        userId,
        street,
        ward,
        district,
        province,
      };
      const response = await axios.post(
        "http://localhost:2000/api/address/addresses",
        addAddress
      );
      const newAddress = response.data;
      toast.success("Thêm địa chỉ thành công!");
      onClose();
      onAdd(newAddress);
    } catch (error) {
      toast.error(
        "Có lỗi xảy ra: " + (error.response?.data.error || error.message)
      );
    }
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} size={"full"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm địa chỉ mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Container maxW="7xl" py={10} px={{ base: 5, md: 8 }}>
              <Stack spacing={10}>
                <VStack
                  as="form"
                  spacing={8}
                  w="100%"
                  bg={useColorModeValue("white", "gray.700")}
                  rounded="lg"
                  boxShadow="lg"
                  p={{ base: 5, sm: 10 }}
                >
                  <VStack spacing={4} w="100%">
                    <Stack
                      w="100%"
                      spacing={3}
                      direction={{ base: "column", md: "row" }}
                    >
                      <FormControl>
                        <FormLabel>Đường</FormLabel>
                        <Input
                          type="text"
                          placeholder="Nhập tên đường của bạn"
                          rounded="md"
                          onChange={(e) => setStreet(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Xã</FormLabel>
                        <Input
                          type="email"
                          placeholder=" Nhập tên xã của bạn"
                          rounded="md"
                          onChange={(e) => setWard(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Huyện/Quận</FormLabel>
                        <Input
                          type="tel"
                          placeholder="Nhập Quận/Huyện của bạn"
                          rounded="md"
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <Input
                          type="tel"
                          placeholder="Nhập Tỉnh/Thành Phố của bạn"
                          rounded="md"
                          onChange={(e) => setProvince(e.target.value)}
                        />
                      </FormControl>
                    </Stack>
                    <Stack
                      w="100%"
                      spacing={3}
                      direction={{ base: "column", md: "row" }}
                    ></Stack>
                  </VStack>
                  <VStack w="100%">
                    <Flex gap={3}>
                      {" "}
                      <Button
                        onClick={handleUpdateUser}
                        mt="5px"
                        px="50px"
                        borderRadius="none"
                        bg="white"
                        color="black"
                        fontWeight="300"
                        boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
                      >
                        Lưu địa chỉ
                      </Button>
                      <Button
                        onClick={onClose}
                        mt="5px"
                        px="50px"
                        borderRadius="none"
                        bg="white"
                        color="black"
                        fontWeight="300"
                        boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
                      >
                        Hủy bỏ
                      </Button>
                    </Flex>
                  </VStack>
                </VStack>
              </Stack>
            </Container>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAddressModel;
