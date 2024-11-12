import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import ModalInfoUser from "./ModalInfoUser";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import {
  selectedPaymentMethodState,
  selectedShippingMethodState,
} from "../Atom/methoShipAtom";

import { useRecoilState, useRecoilValue } from "recoil";
import userTokenAtom from "../Atom/userAtom.js";

const InfoUserCheckout = () => {
  const [user, setUser] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useRecoilState(
    selectedPaymentMethodState
  );
  const [selectedShippingMethod, setSelectedShippingMethod] = useRecoilState(
    selectedShippingMethodState
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const token = useRecoilValue(userTokenAtom);

  const textColor = useColorModeValue("black", "black");

  const [addressDefaut, setAddressDefaut] = useState(null);

  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        `http://localhost:2000/api/user/getUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log(error.message);
      // toast.error("Không thể lấy dữ liệu người dùng."); // Uncomment if you have a toast function
    }
  };
  const fetchDataAdressDefautUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/api/address/addresses/default`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      if (!response.data) {
        return; // Thoát hàm nếu không có dữ liệu
      }
      setAddressDefaut(response.data); // Cập nhật địa chỉ mặc định nếu có
    } catch (error) {
      console.log("Đã xảy ra lỗi khi lấy địa chỉ mặc định:", error);
    }
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleShippingMethodChange = (event) => {
    setSelectedShippingMethod(event.target.value);
  };

  const hasAllData = addressDefaut !== undefined || addressDefaut !== null;

  const isCashOnDeliveryDisabled =
    selectedPaymentMethod !== "Thanh toán khi nhận hàng";
  const isPaypalDisabled = selectedPaymentMethod !== "PayPal";

  useEffect(() => {
    fetchUser();
    fetchDataAdressDefautUser();
  }, []);

  useEffect(() => {
    // Fetch payment and shipping methods (replace with actual API calls if available)
    setPaymentMethods(["Thanh toán khi nhận hàng", "PayPal"]);
    setShippingMethods(["Giao hàng bình thường", "Giao hàng hỏa tốc"]);
  }, []);

  return (
    <Box>
      {" "}
      <VStack w="full" h="full" p={10} spacing={10} align="flex-start">
        <VStack spacing={2} align="flex-start">
          <Heading>Thông tin giao hàng</Heading>
          <Text color={useColorModeValue("green.800", "white")}>
            Thông tin của bạn nếu bạn muốn thay đổi nhấn vào đây:{" "}
            <Tooltip label="Cập nhật thông tin" hasArrow arrowSize={15}>
              <FontAwesomeIcon
                onClick={onOpen}
                cursor={"pointer"}
                icon={faPen}
                size="sm"
              />
            </Tooltip>
          </Text>
        </VStack>
        <SimpleGrid columns={2} columnGap={3} rowGap={4}>
          {/* Thông tin người dùng với shadow */}
          <GridItem colSpan={2}>
            <Box
              p={4}
              shadow="md"
              borderRadius="md"
              bg="white"
              _hover={{ shadow: "lg" }}
              height="auto"
              w={["100%", "100%", "420px"]} // Responsive width: 100% on smaller screens, 420px on larger screens
            >
              <FormControl>
                <Flex alignItems="center" justifyContent="space-between">
                  <FormLabel color={textColor} fontSize={["xs", "sm"]}>
                    {" "}
                    {/* Responsive font size */}
                    Tên của bạn:
                  </FormLabel>
                  <Text
                    fontWeight="bold"
                    fontSize={["xs", "sm"]}
                    color="teal.500"
                  >
                    {user?.username || ""}
                  </Text>
                </Flex>
              </FormControl>

              <Divider my={3} />

              <FormControl>
                <Flex alignItems="center" justifyContent="space-between">
                  <FormLabel color={textColor} fontSize={["xs", "sm"]}>
                    Địa chỉ email:
                  </FormLabel>
                  <Text
                    fontWeight="bold"
                    fontSize={["xs", "sm"]}
                    color="teal.500"
                  >
                    {user?.email || ""}
                  </Text>
                </Flex>
              </FormControl>

              <Divider my={3} />

              <FormControl>
                <Flex alignItems="center" justifyContent="space-between">
                  <FormLabel color={textColor} fontSize={["xs", "sm"]}>
                    Số điện thoại:
                  </FormLabel>
                  <Text
                    fontWeight="bold"
                    fontSize={["xs", "sm"]}
                    color="teal.500"
                  >
                    {user?.numberPhone || ""}
                  </Text>
                </Flex>
              </FormControl>

              <Divider my={3} />

              <FormControl>
                <Flex alignItems="center" justifyContent="space-between">
                  <FormLabel color={textColor} fontSize={["xs", "sm"]} flex="1">
                    Địa chỉ giao hàng:
                  </FormLabel>
                  <Text
                    fontWeight="bold"
                    fontSize={["xs", "sm"]}
                    color="teal.500"
                    flex="2"
                    textAlign="right"
                  >
                    {hasAllData && addressDefaut
                      ? `${addressDefaut.street || "Không có dữ liệu"}, ${
                          addressDefaut.ward || "Không có dữ liệu"
                        }, ${addressDefaut.district || "Không có dữ liệu"}, ${
                          addressDefaut.province || "Không có dữ liệu"
                        }`
                      : "Chưa có địa chỉ"}{" "}
                  </Text>
                </Flex>
              </FormControl>
            </Box>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel
                color={useColorModeValue("green.800", "white")}
                fontSize="sm"
              >
                Chọn phương thức thanh toán:
              </FormLabel>
              <Stack spacing={2}>
                {paymentMethods.map((method, index) => (
                  <Checkbox
                    key={index}
                    value={method}
                    isChecked={selectedPaymentMethod === method}
                    onChange={handlePaymentMethodChange}
                  >
                    {method}
                  </Checkbox>
                ))}
              </Stack>
            </FormControl>
          </GridItem>

          {selectedPaymentMethod === "Thanh toán khi nhận hàng" && (
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel
                  color={useColorModeValue("green.800", "white")}
                  fontSize="sm"
                >
                  Chọn phương thức vận chuyển:
                </FormLabel>
                <Stack spacing={2}>
                  {shippingMethods.map((method, index) => (
                    <Checkbox
                      key={index}
                      value={method}
                      isChecked={selectedShippingMethod === method}
                      onChange={handleShippingMethodChange}
                    >
                      {method}
                    </Checkbox>
                  ))}
                </Stack>
              </FormControl>
            </GridItem>
          )}

          <GridItem colSpan={1}>
            <ModalInfoUser user={user} isOpen={isOpen} onClose={onClose} />
          </GridItem>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default InfoUserCheckout;
