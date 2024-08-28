import React, { useState, useEffect } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Button,
  Text,
} from "@chakra-ui/react";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SubmitOPT = () => {
  const [email, setEmail] = useState(""); // State để lưu email
  const [isLoading, setIsloading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy email từ localStorage khi component mount
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Nếu không có email trong localStorage, có thể chuyển hướng hoặc thông báo lỗi
      navigate("/enterEmail");
    }
  }, [navigate]);

  const handleVerifyOTP = async () => {
    setIsloading(true);
    try {
      const response = await axios.get(
        "http://localhost:2000/api/user/verifyOTP",
        {
          params: { code: otp }, // Gửi mã OTP
        }
      );
      toast.success("Đã xác minh OTP của bạn");
      navigate("/resetPassword"); // Chuyển hướng sau khi thành công
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Lỗi xác minh OTP. Vui lòng thử lại."
      );
    } finally {
      setIsloading(false);
    }
  };

  return (
    <>
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex flex={1} align={"center"} justify={"center"}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            borderRadius={10}
            height={"400px"}
            src={imgSenda}
          />
        </Flex>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading
              bgClip="text"
              bgGradient="linear(to-l, #0ea5e9, #2563eb)"
              fontSize={"2xl"}
            >
              Xác minh mã OTP
            </Heading>
            <FormControl id="otp">
              <FormLabel>Vui lòng nhập mã OTP (chỉ 6 chữ số)</FormLabel>
              <Input
                placeholder="ex: 103421"
                type="text"
                onChange={(e) => setOtp(e.target.value)}
              />
            </FormControl>

            <Stack spacing={6}>
              <Button
                bgGradient="linear(to-l, #0ea5e9, #2563eb)"
                isLoading={isLoading}
                onClick={handleVerifyOTP}
              >
                Xác minh OTP
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Stack>
    </>
  );
};

export default SubmitOPT;
