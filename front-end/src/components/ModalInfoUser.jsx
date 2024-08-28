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

const ModalInfoUser = ({ user, isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // Thêm trạng thái cho ảnh xem trước

  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");

  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [resetUserCurrent, setResetUserCurrent] = useRecoilState(userAtom);

  const userData = localStorage.getItem("userCurrent");
  const userCurrent = userData ? JSON.parse(userData) : null;
  // const userCurrent = useRecoilValue(userAtom);
  const token = userCurrent?.token;
  //  const token = resetUserCurrent?.token;
  const fileInputRef = useRef(null);

  // Lấy danh sách tỉnh thành
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        if (response.data.error === 0) {
          setCitys(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách quận huyện khi chọn tỉnh
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedCityId) {
        try {
          const response = await axios.get(
            `https://esgoo.net/api-tinhthanh/2/${selectedCityId}.htm`
          );
          if (response.data.error === 0) {
            setDistricts(response.data.data);
            setWards([]); // Reset wards khi tỉnh thay đổi
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [selectedCityId]);

  // Lấy danh sách phường xã khi chọn quận
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrictId) {
        try {
          const response = await axios.get(
            `https://esgoo.net/api-tinhthanh/3/${selectedDistrictId}.htm`
          );
          if (response.data.error === 0) {
            setWards(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      }
    };
    fetchWards();
  }, [selectedDistrictId]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setNumberPhone(user.numberPhone || "");
      setAvatar(user.avatar || "");
      setSelectedCityId(user.city || "");
      setSelectedDistrictId(user.district || "");
      setSelectedWardId(user.ward || "");

      // Set ảnh xem trước từ avatar hiện tại
      if (user.avatar) {
        setAvatarPreview(
          `http://localhost:2000/images/${user.avatar.replace("uploads\\", "")}`
        );
      }
    }
  }, [user]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    // Tạo URL để xem trước ảnh
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleUpdateUser = async () => {
    if (
      !username ||
      !email ||
      !numberPhone ||
      !selectedCityId ||
      !selectedDistrictId ||
      !selectedWardId
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi lưu!");
      return;
    }

    try {
      // Tìm đối tượng để lấy tên
      const selectedCity = citys.find((city) => city.id === selectedCityId);
      const selectedDistrict = districts.find(
        (district) => district.id === selectedDistrictId
      );
      const selectedWard = wards.find((ward) => ward.id === selectedWardId);

      // Tạo đối tượng người dùng cập nhật với tên
      const updatedUser = {
        username,
        email,
        numberPhone,
        avatar,
        city: selectedCity ? selectedCity.full_name : "",
        district: selectedDistrict ? selectedDistrict.full_name : "",
        ward: selectedWard ? selectedWard.full_name : "",
      };

      const response = await axios.put(
        "http://localhost:2000/api/user/updateUser",
        updatedUser,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Cập nhật thành công!");

      setResetUserCurrent((prev) => {
        const updatedUserData = { ...prev, ...response.data.updatedUser };
        localStorage.setItem("userCurrent", JSON.stringify(updatedUserData));
        return updatedUserData;
      });
      onClose();
    } catch (error) {
      toast.error(
        "Có lỗi xảy ra: " + (error.response?.data.error || error.message)
      );
    }
  };

  // Find selected city, district, and ward objects
  const selectedCity = citys.find((city) => city.id === selectedCityId);
  const selectedDistrict = districts.find(
    (district) => district.id === selectedDistrictId
  );
  const selectedWard = wards.find((ward) => ward.id === selectedWardId);

  return (
    <>
      <Modal isCentered isOpen={isOpen} size={"full"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chỉnh sửa hồ sơ cá nhân</ModalHeader>
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
                  <Flex alignItems="center" justifyContent="center" gap={4}>
                    <Box>
                      <Image
                        borderRadius="full"
                        boxSize="150px"
                        src={
                          avatarPreview ||
                          `http://localhost:2000/images/${user?.avatar?.replace(
                            "uploads\\",
                            ""
                          )}`
                        }
                        alt="Avatar"
                      />
                    </Box>
                    <Box>
                      <Button
                        bgGradient="linear(to-l, #0ea5e9,#2563eb)"
                        onClick={handleButtonClick}
                      >
                        Thay đổi ảnh
                      </Button>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      />
                    </Box>
                  </Flex>

                  <VStack spacing={4} w="100%">
                    <Stack
                      w="100%"
                      spacing={3}
                      direction={{ base: "column", md: "row" }}
                    >
                      <FormControl>
                        <FormLabel>Tên của bạn</FormLabel>
                        <Input
                          type="text"
                          placeholder="Ahmad"
                          rounded="md"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Địa chỉ Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="test@test.com"
                          rounded="md"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Số điện thoại</FormLabel>
                        <Input
                          type="tel"
                          placeholder="0123456789"
                          rounded="md"
                          value={numberPhone}
                          onChange={(e) => setNumberPhone(e.target.value)}
                        />
                      </FormControl>
                    </Stack>
                    <Stack
                      w="100%"
                      spacing={3}
                      direction={{ base: "column", md: "row" }}
                    >
                      <FormControl>
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <Select
                          placeholder="Chọn tỉnh/thành phố"
                          rounded="md"
                          value={selectedCityId}
                          onChange={(e) => setSelectedCityId(e.target.value)}
                        >
                          <option value="">Tỉnh Thành</option>
                          {citys.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.full_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Huyện/Xã</FormLabel>
                        <Select
                          placeholder="Chọn huyện/xã"
                          rounded="md"
                          value={selectedDistrictId}
                          onChange={(e) =>
                            setSelectedDistrictId(e.target.value)
                          }
                          disabled={!selectedCityId}
                        >
                          <option value="">Huyện/Xã</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.id}>
                              {district.full_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Phường/Xã</FormLabel>
                        <Select
                          placeholder="Chọn phường/xã"
                          rounded="md"
                          value={selectedWardId}
                          onChange={(e) => setSelectedWardId(e.target.value)}
                          disabled={!selectedDistrictId}
                        >
                          <option value="">Phường/Xã</option>
                          {wards.map((ward) => (
                            <option key={ward.id} value={ward.id}>
                              {ward.full_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </VStack>
                  <VStack w="100%">
                    <Button
                      onClick={handleUpdateUser}
                      bg={"red"}
                      color="white"
                      _hover={{
                        bg: "green.500",
                      }}
                      rounded="md"
                      w={{ base: "100%", md: "max-content" }}
                    >
                      Lưu thông tin
                    </Button>
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

export default ModalInfoUser;
