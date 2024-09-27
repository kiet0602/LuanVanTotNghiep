import React, { useEffect, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import {
  selectedPaymentMethodState,
  selectedShippingMethodState,
} from "../Atom/methoShipAtom";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const InfoCartCheckout = ({ items, total }) => {
  const userData = localStorage.getItem("userCurrent");
  const userCurrent = userData ? JSON.parse(userData) : null;
  const [user, setUser] = useState(null);
  const userId = userCurrent?._id;

  const bgColor = useColorModeValue("gray.50", "whiteAlpha.50");
  const textColor = useColorModeValue("gray.600", "whiteAlpha.600");

  const navigate = useNavigate(); // Khởi tạo hook navigate
  const [couponCode, setCouponCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(total);
  const [error, setError] = useState("");

  const taxAmount = 20000; // Thuế
  const shippingFeeThreshold = 300000; // Ngưỡng miễn phí vận chuyển

  const standardShippingFeeAmount = 20000; // Phí vận chuyển tiêu chuẩn
  const expressShippingFeeAmount = 40000; // Phí vận chuyển nhanh

  const selectedShippingMethod = useRecoilValue(selectedShippingMethodState);
  const selectedPaymentMethod = useRecoilValue(selectedPaymentMethodState);

  const isCashOnDeliveryDisabled =
    selectedPaymentMethod !== "Thanh toán khi nhận hàng";
  const isPaypalDisabled = selectedPaymentMethod !== "PayPal";

  // Hàm tính toán tổng tiền cuối cùng
  const calculateTotal = () => {
    const shippingFee =
      total > shippingFeeThreshold
        ? 0
        : selectedShippingMethod === "Giao hàng hỏa tốc"
        ? expressShippingFeeAmount
        : standardShippingFeeAmount;
    const finalPrice = discountedTotal + shippingFee + taxAmount;
    return finalPrice;
  };

  const shippingFee =
    total > shippingFeeThreshold
      ? 0
      : selectedShippingMethod === "Giao hàng hỏa tốc"
      ? expressShippingFeeAmount
      : standardShippingFeeAmount;

  // Gọi API lấy thông tin người dùng
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
      }
    };
    fetchUser();
  }, [userId]);

  // Hàm gọi API áp dụng mã khuyến mãi
  const applyCoupon = async () => {
    try {
      const response = await axios.post(
        "http://localhost:2000/api/coupon/coupon-apply",
        {
          couponCode,
          totalPrice: total,
        }
      );
      setDiscountedTotal(response.data.finalPrice);
      setError(""); // Xóa lỗi nếu áp dụng thành công
    } catch (error) {
      toast.error(
        error.response.data.message || "Có lỗi xảy ra khi áp dụng mã khuyến mãi"
      );
    }
  };

  // Hàm thanh toán - gọi API checkout
  const handlePayment = async () => {
    try {
      const orderData = {
        userId,
        items, // Danh sách sản phẩm từ frontend
        totalPrice: total,
        shippingFee: shippingFee,
        discountedTotal: calculateTotal(), // Tổng tiền đã tính thuế và phí vận chuyển
        selectedShippingMethod, // Phương thức vận chuyển
        selectedPaymentMethod, // Phương thức thanh toán
        couponCode, // Mã khuyến mãi (nếu có)
      };
      await axios.post(
        "http://localhost:2000/api/checkout/checkOut", // Gửi dữ liệu đến API checkout
        orderData
      );
      navigate("/success");
      toast.success("Đơn hàng đã được tạo thành công!"); // Hiển thị thông báo thành công
    } catch (err) {
      toast.error(err.response.data.message);
      console.error(err);
    }
  };

  return (
    <>
      <Box>
        <VStack
          w="full"
          h="full"
          p={10}
          spacing={6}
          align="flex-start"
          bg={bgColor}
        >
          <VStack alignItems="flex-start" spacing={3}>
            <Heading size="xl">Thông tin sản phẩm</Heading>
          </VStack>
          {items.map((item, index) => (
            <HStack spacing={6} alignItems="center" w="full" key={index}>
              <AspectRatio ratio={1} w={24}>
                <Image
                  src={`http://localhost:2000/images/${item.product.image[0]}`} // Đường dẫn hình ảnh
                  alt={item.product.productName}
                  objectFit="cover" // Đảm bảo hình ảnh không bị kéo dãn
                />
              </AspectRatio>
              <Stack
                spacing={0}
                w="full"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <VStack w="full" spacing={0} alignItems="flex-start">
                  <Heading w={"200px"} size="sm">
                    {item?.product?.productName}
                  </Heading>
                </VStack>
                <HStack spacing={4} alignItems="center">
                  <Text fontSize="sm" marginRight="50px">
                    {" "}
                    {item.quantity}
                  </Text>
                  <Heading size="sm">
                    {item.totalPriceItemCart.toLocaleString()}
                    <span style={{ whiteSpace: "nowrap" }}> Đ</span>
                  </Heading>
                </HStack>
              </Stack>
            </HStack>
          ))}
          <VStack spacing={4} alignItems="stretch" w="full">
            <HStack justifyContent="space-between">
              <Text color={textColor}>Tổng tiền sản phẩm: </Text>
              <Heading size="sm">{total.toLocaleString()} Đ</Heading>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color={textColor}>Tiền ship: </Text>
              <Heading size="sm">
                {total > shippingFeeThreshold
                  ? "Miễn phí"
                  : selectedShippingMethod === "Giao hàng hỏa tốc"
                  ? `${expressShippingFeeAmount.toLocaleString()} Đ`
                  : `${standardShippingFeeAmount.toLocaleString()} Đ`}
              </Heading>
            </HStack>
            <HStack justifyContent="space-between">
              <Text color={textColor}>Thuế: </Text>
              <Heading size="sm">{taxAmount.toLocaleString()} Đ</Heading>
            </HStack>
          </VStack>
          <Divider />
          <Stack spacing={4}>
            <HStack spacing={4}>
              <Input
                placeholder="Nhập mã khuyến mãi"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button onClick={applyCoupon}>Áp dụng</Button>
            </HStack>

            {/* Hiển thị thành công */}
          </Stack>
          <Divider />
          <HStack justifyContent="space-between" w="full" py={"20px"}>
            <Text color={textColor}>Tổng tiền:</Text>
            <Heading size="lg">{calculateTotal().toLocaleString()} Đ</Heading>
          </HStack>

          <Button
            color={"white"}
            bg={"blue"}
            w="full"
            h={"30px"}
            isDisabled={isCashOnDeliveryDisabled} // Nút "Thanh toán khi nhận hàng" chỉ có thể nhấn khi phương thức này được chọn
            onClick={handlePayment}
          >
            Thanh toán khi nhận hàng
          </Button>
          <Button
            color={"white"}
            bg={"blue"}
            w="full"
            h={"30px"}
            isDisabled={isPaypalDisabled} // Nút "Thanh toán Paypal" chỉ có thể nhấn khi PayPal được chọn
          >
            Thanh toán Paypal
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default InfoCartCheckout;
