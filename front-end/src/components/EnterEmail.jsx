import React, { useState } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Button,
} from "@chakra-ui/react";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const EnterEmail = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  // Gửi mã OTP
  const handleSendOTP = async () => {
    setIsloading(true);

    try {
      const otpResponse = await axios.get(
        "http://localhost:2000/api/user/generateOTP",
        {
          params: { email },
        }
      );
      const otpCode = otpResponse.data.code;
      const emailResponse = await axios.post(
        "http://localhost:2000/api/user/registerMail",
        {
          userEmail: email,
          text: `Mã OTP của bạn là: ${otpCode}`,
          subject: "Mã OTP của bạn",
        }
      );
      toast.success("Bạn đã nhận được mã OTP qua email.");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setIsloading(false);
      navigate("/submitOTP");
    }
  };
  // lưu gmail vào localStorage
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail); // Cập nhật giá trị của atom
    localStorage.setItem("userEmail", newEmail);
  };

  return (
    <>
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading
              bgClip="text"
              bgGradient="linear(to-l, #0ea5e9, #2563eb)"
              fontSize={"2xl"}
            >
              Lấy lại mật khẩu bằng địa chỉ Email
            </Heading>
            <FormControl id="email">
              <FormLabel>Vui lòng nhập địa chỉ Email</FormLabel>
              <Input
                placeholder="Ex: ten@gmail.com"
                type="email"
                onChange={handleEmailChange}
              />
            </FormControl>

            <Stack spacing={6}>
              <Button
                bgGradient="linear(to-l, #0ea5e9, #2563eb)"
                isLoading={isLoading}
                onClick={handleSendOTP}
              >
                Lấy OTP
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1} align={"center"} justify={"center"}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            borderRadius={10}
            height={"400px"}
            src={imgSenda}
          />
        </Flex>
      </Stack>
    </>
  );
};

export default EnterEmail;
