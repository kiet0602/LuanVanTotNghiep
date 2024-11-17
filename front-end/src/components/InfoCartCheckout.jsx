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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import userTokenAtom from "../Atom/userAtom.js";

const InfoCartCheckout = ({ items, total }) => {
  const [user, setUser] = useState(null);
  const userId = user?._id;
  const token = useRecoilValue(userTokenAtom);

  const bgColor = useColorModeValue("gray.50", "whiteAlpha.50");
  const textColor = useColorModeValue("gray.600", "whiteAlpha.600");
  const navigate = useNavigate(); // Khởi tạo hook navigate
  const [couponCode, setCouponCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(total);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addressId, setAddressId] = useState("");

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
      selectedPaymentMethod === "PayPal" // Kiểm tra phương thức thanh toán
        ? 0
        : total > shippingFeeThreshold
        ? 0
        : selectedShippingMethod === "Giao hàng hỏa tốc"
        ? expressShippingFeeAmount
        : standardShippingFeeAmount;

    const finalPrice = discountedTotal + shippingFee + taxAmount;
    return finalPrice;
  };

  const shippingFee =
    selectedPaymentMethod === "PayPal" // Kiểm tra phương thức thanh toán
      ? 0
      : total > shippingFeeThreshold
      ? 0
      : selectedShippingMethod === "Giao hàng hỏa tốc"
      ? expressShippingFeeAmount
      : standardShippingFeeAmount;

  // Gọi API lấy thông tin người dùng
  const fetchUser = async () => {
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
    }
  };

  // Hàm gọi API áp dụng mã khuyến mãi
  const applyCoupon = async () => {
    console.log("Coupon Code:", couponCode);
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
        console.log("Không có địa chỉ mặc định");
        return; // Thoát hàm nếu không có dữ liệu
      }
      setAddressId(response.data._id);
    } catch (error) {
      console.log("Đã xảy ra lỗi khi lấy địa chỉ mặc định:", error);
    }
  };

  // Hàm thanh toán - gọi API checkout
  const handlePayment = async () => {
    setIsLoading(true);

    // Kiểm tra dữ liệu đầu vào
    if (
      !items.length ||
      total <= 0 ||
      shippingFee < 0 ||
      !selectedShippingMethod ||
      !selectedPaymentMethod ||
      !addressId
    ) {
      // Nếu không có địa chỉ, yêu cầu người dùng chọn địa chỉ
      if (!addressId) {
        const confirmNavigation = window.confirm(
          "Bạn chưa có địa chỉ giao hàng. Bạn có muốn chuyển đến trang chọn địa chỉ mặc định không?"
        );

        if (confirmNavigation) {
          navigate("/profileUser"); // Thay đổi đường dẫn thành trang chọn địa chỉ của bạn
        }
        setIsLoading(false);
        return; // Dừng hàm nếu có lỗi
      }

      toast.error("Vui lòng điền đầy đủ thông tin trước khi thanh toán.");
      setIsLoading(false);
      return; // Dừng hàm nếu có lỗi
    }

    try {
      const orderData = {
        items, // Danh sách sản phẩm từ frontend
        totalPrice: total,
        shippingFee: shippingFee,
        discountedTotal: calculateTotal(), // Tổng tiền đã tính thuế và phí vận chuyển
        selectedShippingMethod, // Phương thức vận chuyển
        selectedPaymentMethod, // Phương thức thanh toán
        couponCode, // Mã khuyến mãi (nếu có)
        addressId,
      };

      {
        // Gửi dữ liệu đến API checkout cho phương thức thanh toán khác (như COD)
        await axios.post(
          "http://localhost:2000/api/checkout/checkOut", // Gửi dữ liệu đến API checkout
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          }
        );

        navigate("/success");
        toast.success("Đơn hàng đã được tạo thành công!"); // Hiển thị thông báo thành công
      }
    } catch (err) {
      toast.error(
        err.response.data.message ||
          "Có lỗi xảy ra trong quá trình tạo đơn hàng."
      ); // Hiển thị thông báo lỗi
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async () => {
    const currentCouponCode = couponCode; // Lưu giá trị hiện tại của couponCode
    console.log("Coupon Code trước khi gửi:", currentCouponCode);

    try {
      const orderData = {
        userId,
        items,
        totalPrice: total,
        shippingFee: shippingFee,
        discountedTotal: calculateTotal(),
        selectedShippingMethod: "Giao hàng hỏa tốc",
        selectedPaymentMethod,
        couponCode: currentCouponCode, // Dùng biến tạm thời thay vì lấy trực tiếp từ state
        addressId,
      };

      const response = await axios.post(
        "http://localhost:2000/api/paypal/create-order",
        orderData
      );
      if (
        !response.data.approvalUrl.approveLink ||
        !response.data.approvalUrl.orderId
      ) {
        throw new Error("No order ID or approve link returned from backend");
      }
      return response.data.approvalUrl.orderId;
    } catch (error) {
      throw error;
    }
  };

  // Định nghĩa hàm onApprove bên ngoài
  const onApprove = async (data) => {
    try {
      const orderData = {
        userId,
        items,
        totalPrice: total,
        shippingFee: shippingFee,
        discountedTotal: calculateTotal(),
        selectedShippingMethod: "Giao hàng hỏa tốc",
        selectedPaymentMethod,
        couponCode,
        addressId,
      };

      if (!data.orderID) {
        throw new Error("Order ID is undefined");
      }

      await axios.post("http://localhost:2000/api/paypal/capture-order", {
        orderId: data.orderID,
        orderData,
      });

      //  window.location.reload();
      navigate("/success");
      toast.success("Đơn hàng đã được tạo thành công!"); // Hiển thị thông báo thành công
    } catch (error) {
      alert("Có lỗi xảy ra khi xác thực thanh toán. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDataAdressDefautUser(); // Gọi hàm lấy địa chỉ mặc định
  }, []);

  return (
    <>
      <Box pl={"50px"}>
        <VStack w="full" p={10} spacing={6} align="flex-start" bg={bgColor}>
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
                {selectedPaymentMethod === "PayPal" // Kiểm tra phương thức thanh toán
                  ? "Miễn phí"
                  : total > shippingFeeThreshold
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
            {selectedPaymentMethod === "Thanh toán khi nhận hàng" ? (
              <HStack spacing={4}>
                <Input
                  placeholder="Nhập mã khuyến mãi"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                  }}
                />
                <Button onClick={applyCoupon}>Áp dụng</Button>
              </HStack>
            ) : (
              <HStack>
                <Text>
                  Do bạn thanh toán bằng phương thức Paypal nên bạn sẽ không
                  được áp dụng mã khuyến mãi
                </Text>
              </HStack>
            )}

            {/* Hiển thị thành công */}
          </Stack>
          <Divider />
          <HStack justifyContent="space-between" w="full" py={"20px"}>
            <Text color={textColor}>Tổng tiền:</Text>
            <Heading size="lg">{calculateTotal().toLocaleString()} Đ</Heading>
          </HStack>

          {/* Nút thanh toán */}
          <HStack width="full" justifyContent="space-between">
            {selectedPaymentMethod === "Thanh toán khi nhận hàng" ? (
              <Button
                onClick={handlePayment}
                isLoading={isLoading}
                isDisabled={isCashOnDeliveryDisabled}
                mt="5px"
                px="50px"
                borderRadius="none"
                bg={useColorModeValue("red.500", "white")}
                color={useColorModeValue("white", "black")}
                fontWeight="300"
                boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
                width="full"
              >
                Thanh toán khi nhận hàng
              </Button>
            ) : selectedPaymentMethod === "PayPal" ? (
              <Box width="100%">
                <PayPalScriptProvider
                  options={{
                    "client-id":
                      "Af_K7Ncy65OjZuTGjZkap5G_wHCIabKc-Fe9-KX-OR5spwdiS8LXR5htqzRKCQSEeflgpQybZG6wDNNv",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical", width: "100%" }}
                    // Đặt chiều rộng 100% cho nút PayPal
                    createOrder={createOrder}
                    onApprove={onApprove}
                  />
                </PayPalScriptProvider>
              </Box>
            ) : null}{" "}
            {/* Không hiển thị gì nếu không chọn phương thức nào */}
          </HStack>
        </VStack>
      </Box>
    </>
  );
};

export default InfoCartCheckout;
