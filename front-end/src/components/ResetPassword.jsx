import React, { useState, useEffect } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Button,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState(""); // State để lưu email
  const [isLoading, setIsloading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy email từ localStorage khi component mount
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Nếu không có email trong localStorage, có thể chuyển hướng hoặc thông báo lỗi
      navigate("/signIn");
    }
  }, [navigate]);

  const handleResetPassword = async () => {
    setIsloading(true);
    try {
      const response = await axios.put(
        "http://localhost:2000/api/user/resetPassword",
        {
          email,
          password,
        }
      );
      toast.success("Lấy lại mật khẩu thành công");
      localStorage.removeItem("userEmail");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại."
      );
    } finally {
      setIsloading(false);
      navigate("/signIn");
    }
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
              Lấy lại mật khẩu
            </Heading>
            <Text fontWeight={"bold"}>
              Email yêu cầu lấy mật khẩu : {email}
            </Text>
            <FormControl id="password">
              <FormLabel>Mật khẩu mới</FormLabel>
              <Input
                placeholder=""
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={6}>
              <Button
                bgGradient="linear(to-l, #0ea5e9, #2563eb)"
                isLoading={isLoading}
                onClick={handleResetPassword}
              >
                Đặt lại mật khẩu
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Stack>
    </>
  );
};

export default ResetPassword;
