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
import { useRecoilState } from "recoil";

const InfoUserCheckout = () => {
  const userData = localStorage.getItem("userCurrent");
  const userCurrent = userData ? JSON.parse(userData) : null;
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
  const userId = userCurrent?._id;

  const textColor = useColorModeValue("gray.600", "whiteAlpha.600");

  const fetchUser = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:2000/api/user/getUser/${userId}`
      );
      setUser(response.data);
    } catch (error) {
      console.log(error.message);
      // toast.error("Không thể lấy dữ liệu người dùng."); // Uncomment if you have a toast function
    }
  };

  useEffect(() => {
    // Fetch payment and shipping methods (replace with actual API calls if available)
    setPaymentMethods(["Thanh toán khi nhận hàng", "PayPal"]);
    setShippingMethods(["Giao hàng bình thường", "Giao hàng hỏa tốc"]);
  }, []);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleShippingMethodChange = (event) => {
    setSelectedShippingMethod(event.target.value);
  };

  const hasAllData = user?.ward && user?.district && user?.city;

  const isCashOnDeliveryDisabled =
    selectedPaymentMethod !== "Thanh toán khi nhận hàng";
  const isPaypalDisabled = selectedPaymentMethod !== "PayPal";

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <Box>
      {" "}
      <VStack w="full" h="full" p={10} spacing={10} align="flex-start">
        <VStack spacing={2} align="flex-start">
          <Heading>Thông tin giao hàng</Heading>
          <Text color={textColor}>
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
          <GridItem colSpan={1}>
            <Box>
              <FormControl>
                <Flex>
                  <FormLabel color={textColor}>Tên của bạn:</FormLabel>
                  <Text fontWeight={"bold"}>{user?.username || ""}</Text>
                </Flex>
              </FormControl>
            </Box>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <Flex>
                <FormLabel color={textColor}>Địa chỉ email:</FormLabel>
                <Text fontWeight={"bold"}>{user?.email}</Text>
              </Flex>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <Flex>
                <FormLabel color={textColor}>Số điện thoại:</FormLabel>
                <Text fontWeight={"bold"}>{user?.numberPhone}</Text>
              </Flex>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <Flex>
                <FormLabel color={textColor}>Địa chỉ giao hàng:</FormLabel>
                <Text fontWeight={"bold"}>
                  {hasAllData
                    ? ` ${user?.ward}, ${user?.district}, ${user?.city}`
                    : "Không có dữ liệu"}
                </Text>
              </Flex>
            </FormControl>
          </GridItem>
          <Divider />
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel color={textColor}>
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
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel color={textColor}>
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

          <GridItem colSpan={1}>
            <ModalInfoUser
              user={user}
              isOpen={isOpen}
              onClose={onClose}
              // onUpdate={handleUpdate} // Pass the update handler to the modal
            />
          </GridItem>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default InfoUserCheckout;
