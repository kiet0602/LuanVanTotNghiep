import { useState } from "react";
import {
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  Box,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
//thư viện
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
//Hook custom
import useNavigateCustom from "../Hook/useNavigateCustom";
//component
import ButtonSighIn from "./ButtonSignIn";
//data
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import userAtom from "../Atom/userAtom";

const SignIn = () => {
  //khai báo
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //khai báo useCustom
  const { goRegister, goHome } = useNavigateCustom();

  const [setResetUserCurrent] = useRecoilState(userAtom);

  //handle
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const handleClickStatePassword = () => setShow(!show);
  //handle gọi API

  const handleLogin = async () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Mật khẩu không được để trống.");
      isValid = false;
    }

    if (!isValid) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:2000/api/user/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userCurrent", JSON.stringify(response.data));
      toast.success("Đăng nhập thành công!");
      goHome();
    } catch (error) {
      toast.error("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!");
    } finally {
      setIsLoading(false);
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
              Tài khoảng đăng nhập của bạn
            </Heading>
            <FormControl id="email" isInvalid={!!emailError}>
              <FormLabel>Địa chỉ Email</FormLabel>
              <Input
                placeholder="Ex: ten@gmail.com"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isInvalid={!!passwordError}>
              <FormLabel>Mật khẩu</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    color={useColorModeValue("gray.900", "gray.100")}
                    onClick={handleClickStatePassword}
                  >
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Text>Bạn có tài khoảng chưa?</Text>

                <Text
                  bgClip="text"
                  bgGradient="linear(to-l, #0ea5e9, #2563eb)"
                  fontWeight={"bold"}
                  cursor={"pointer"}
                  _hover={{ color: "white" }}
                  onClick={goRegister}
                >
                  Đăng kí
                </Text>
              </Stack>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Text>Quên mật khẩu?</Text>

                <Text
                  bgClip="text"
                  bgGradient="linear(to-l, #0ea5e9, #2563eb)"
                  fontWeight={"bold"}
                  cursor={"pointer"}
                  _hover={{ color: "white" }}
                  onClick={goRegister}
                >
                  Lấy lại mật khẩu
                </Text>
              </Stack>

              <ButtonSighIn handleLogin={handleLogin} isLoading={isLoading} />
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

export default SignIn;
