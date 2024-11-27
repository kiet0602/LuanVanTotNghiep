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

// const AddAddressModel = ({ isOpen, onClose, onAdd }) => {
//   const [street, setStreet] = useState("");
//   const [ward, setWard] = useState("");
//   const [district, setDistrict] = useState("");
//   const [province, setProvince] = useState("");

//   const token = useRecoilValue(userTokenAtom);

//   // Hàm cập nhật địa chỉ
//   const handleUpdateUser = async () => {
//     if (!street || !ward || !district || !province) {
//       toast.error("Vui lòng điền đầy đủ thông tin trước khi lưu!");
//       return;
//     }
//     try {
//       const addAddress = {
//         street,
//         ward,
//         district,
//         province,
//       };
//       const response = await axios.post(
//         "http://localhost:2000/api/address/addresses",
//         addAddress,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Thêm token vào header
//           },
//         }
//       );
//       const newAddress = response.data;
//       toast.success("Thêm địa chỉ thành công!");
//       onClose();
//       onAdd(newAddress);
//     } catch (error) {
//       toast.error(
//         "Có lỗi xảy ra: " + (error.response?.data.error || error.message)
//       );
//     }
//   };

//   return (
//     <>
//       <Modal isCentered isOpen={isOpen} size={"full"} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Thêm địa chỉ mới</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Container maxW="7xl" py={10} px={{ base: 5, md: 8 }}>
//               <Stack spacing={10}>
//                 <VStack
//                   as="form"
//                   spacing={8}
//                   w="100%"
//                   bg={useColorModeValue("white", "gray.700")}
//                   rounded="lg"
//                   boxShadow="lg"
//                   p={{ base: 5, sm: 10 }}
//                 >
//                   <VStack spacing={4} w="100%">
//                     <Stack
//                       w="100%"
//                       spacing={3}
//                       direction={{ base: "column", md: "row" }}
//                     >
//                       <FormControl>
//                         <FormLabel>Đường</FormLabel>
//                         <Input
//                           type="text"
//                           placeholder="Nhập tên đường của bạn"
//                           rounded="md"
//                           onChange={(e) => setStreet(e.target.value)}
//                         />
//                       </FormControl>
//                       <FormControl>
//                         <FormLabel>Xã</FormLabel>
//                         <Input
//                           type="email"
//                           placeholder=" Nhập tên xã của bạn"
//                           rounded="md"
//                           onChange={(e) => setWard(e.target.value)}
//                         />
//                       </FormControl>
//                       <FormControl>
//                         <FormLabel>Huyện/Quận</FormLabel>
//                         <Input
//                           type="tel"
//                           placeholder="Nhập Quận/Huyện của bạn"
//                           rounded="md"
//                           onChange={(e) => setDistrict(e.target.value)}
//                         />
//                       </FormControl>
//                       <FormControl>
//                         <FormLabel>Tỉnh/Thành phố</FormLabel>
//                         <Input
//                           type="tel"
//                           placeholder="Nhập Tỉnh/Thành Phố của bạn"
//                           rounded="md"
//                           onChange={(e) => setProvince(e.target.value)}
//                         />
//                       </FormControl>
//                     </Stack>
//                     <Stack
//                       w="100%"
//                       spacing={3}
//                       direction={{ base: "column", md: "row" }}
//                     ></Stack>
//                   </VStack>
//                   <VStack w="100%">
//                     <Flex gap={3}>
//                       {" "}
//                       <Button
//                         onClick={handleUpdateUser}
//                         mt="5px"
//                         px="50px"
//                         borderRadius="none"
//                         bg="blue.300"
//                         color="white"
//                         fontWeight="300"
//                         boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
//                       >
//                         Lưu địa chỉ
//                       </Button>
//                       <Button
//                         onClick={onClose}
//                         mt="5px"
//                         px="50px"
//                         borderRadius="none"
//                         bg="red.200"
//                         color="black"
//                         fontWeight="300"
//                         boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
//                       >
//                         Hủy bỏ
//                       </Button>
//                     </Flex>
//                   </VStack>
//                 </VStack>
//               </Stack>
//             </Container>
//           </ModalBody>
//           <ModalFooter></ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default AddAddressModel;

const AddAddressModel = ({ isOpen, onClose, onAdd }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [street, setStreet] = useState("");

  const token = useRecoilValue(userTokenAtom);

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        setProvinces(response?.data?.data);
        console.log(response?.data?.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh/thành phố:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (!selectedProvince) return;
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          `https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`
        );
        setDistricts(response?.data?.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách quận/huyện:", error);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Lấy danh sách xã/phường khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict) return;
    const fetchWards = async () => {
      try {
        const response = await axios.get(
          `https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`
        );
        setWards(response?.data?.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách xã/phường:", error);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  // Hàm lưu địa chỉ
  const handleUpdateUser = async () => {
    if (!street || !selectedWard || !selectedDistrict || !selectedProvince) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi lưu!");
      return;
    }
    const provinceName =
      provinces.find((p) => p.id === selectedProvince)?.name || "";
    const districtName =
      districts.find((d) => d.id === selectedDistrict)?.name || "";
    const wardName = wards.find((w) => w.id === selectedWard)?.name || "";
    try {
      const addAddress = {
        street,
        ward: wardName,
        district: districtName,
        province: provinceName,
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
      setStreet("");
      setSelectedDistrict("");

      setSelectedWard("");
    } catch (error) {
      toast.error(
        "Có lỗi xảy ra: " + (error.response?.data.error || error.message)
      );
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} size={"full"} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm địa chỉ mới</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Container maxW="7xl" py={10} px={{ base: 5, md: 8 }}>
            <Stack spacing={10}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    {provinces.map((province) => (
                      <option key={province?.id} value={province?.id}>
                        {province?.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    {districts.map((district) => (
                      <option key={district?.id} value={district?.id}>
                        {district?.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Xã/Phường</FormLabel>
                  <Select
                    placeholder="Chọn Xã/Phường"
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    {wards.map((ward) => (
                      <option key={ward?.id} value={ward?.id}>
                        {ward?.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Đường</FormLabel>
                  <Input
                    type="text"
                    placeholder="Nhập tên đường của bạn"
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </FormControl>
              </VStack>
              <Button colorScheme="blue" onClick={handleUpdateUser}>
                Lưu địa chỉ
              </Button>
            </Stack>
          </Container>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default AddAddressModel;
