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

import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import userTokenAtom from "../Atom/userAtom.js";

const AddAddressModel = ({ isOpen, onClose, onAdd }) => {
  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");

  const token = useRecoilValue(userTokenAtom);

  const handleUpdateUser = async () => {
    if (!street || !ward || !district || !province) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi lưu!");
      return;
    }
    try {
      const addAddress = {
        street,
        ward,
        district,
        province,
      };
      const response = await axios.post(
        "http://localhost:2000/api/address/addresses",
        addAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
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
                        bg="blue.300"
                        color="white"
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
                        bg="red.200"
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
