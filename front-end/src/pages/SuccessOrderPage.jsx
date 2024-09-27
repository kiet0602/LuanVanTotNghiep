import React, { useEffect, useState } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";

const SuccessOrderPage = () => {
  const [countdown, setCountdown] = useState(5); // State để đếm ngược
  const navigate = useNavigate();

  // Hàm đếm ngược 5 giây rồi quay về trang chủ
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1); // Giảm 1 giây mỗi lần
    }, 1000); // Cứ mỗi 1 giây giảm

    // Khi countdown về 0, điều hướng về trang chủ
    if (countdown === 0) {
      navigate("/");
    }

    return () => clearInterval(timer); // Dọn dẹp khi component bị unmount
  }, [countdown, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
      py={10}
      px={6}
    >
      <img
        src={imgSenda}
        alt="Senda Image"
        style={{
          height: "200px",
          width: "200px",
          borderRadius: "25px",
        }}
      />

      <Heading as="h2" size="xl" mt={6} mb={2}>
        Đặt hàng thành công
      </Heading>
      <Text color={"gray.500"} mb={4}>
        Cảm ơn quý khách đã mua hàng tại Plant Paradise. Chúng tôi trân trọng sự
        ủng hộ của quý khách!
      </Text>
      <Text color={"green.500"}>Quay về trang chủ sau {countdown} giây...</Text>
    </Box>
  );
};

export default SuccessOrderPage;
