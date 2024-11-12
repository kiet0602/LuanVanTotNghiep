import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
} from "@chakra-ui/react";
//thư viện
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
//components

//Hook Custom

import useNavigateCustom from "../Hook/useNavigateCustom";
//data
/* const avatars = [
  {
    name: "Ryan Florence",
    url: "https://bit.ly/ryan-florence",
  },
  {
    name: "Ryan Florence",
    url: "https://bit.ly/ryan-florence",
  },
  {
    name: "Ryan Florence",
    url: "https://bit.ly/ryan-florence",
  },
  {
    name: "Segun Adebayo",
    url: "https://bit.ly/sage-adebayo",
  },
  {
    name: "Kent Dodds",
    url: "https://bit.ly/kent-c-dodds",
  },
  {
    name: "Prosper Otemuyiwa",
    url: "https://bit.ly/prosper-baba",
  },
  {
    name: "Christian Nwamba",
    url: "https://bit.ly/code-beast",
  },
]; */

const SighUp = () => {
  //khai báo
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //khai báo useCustom
  const { goLogin } = useNavigateCustom();

  const handleRegister = async () => {
    // Xác thực dữ liệu form
    if (!username || !email || !password || !confirmPassword || !numberPhone) {
      toast.error("Tất cả các trường đều bắt buộc!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    // Xác thực email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    // Xác thực mật khẩu
    if (password.length < 6) {
      toast.error("Mật khẩu phải ít nhất 6 ký tự!");
      return;
    }

    // Xác thực số điện thoại
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(numberPhone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }
    setIsLoading(true);

    try {
      await axios.post("http://localhost:2000/api/user/register", {
        username,
        email,
        password,
        numberPhone,
      });
      toast.success("Đăng kí thành công!");
      goLogin();
    } catch (error) {
      toast.error(error.response?.data?.error || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box position={"relative"}>
        <Container
          as={SimpleGrid}
          maxW={"7xl"}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 5, sm: 10, lg: 16 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            >
              <Text bgGradient="linear(to-l, #0ea5e9,#2563eb)" bgClip="text">
                {" "}
                Shop tree{" "}
              </Text>
              🌼
              <Text as={"span"}>chào đón bạn</Text>
            </Heading>
            <Stack direction={"row"} spacing={4} align={"center"}>
              {/*     <AvatarGroup>
                {avatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    name={avatar.name}
                    src={avatar.url}
                    size={useBreakpointValue({ base: "md", md: "lg" })}
                    position={"relative"}
                    zIndex={2}
                    _before={{
                      content: '""',
                      width: "full",
                      height: "full",
                      rounded: "full",
                      transform: "scale(1.125)",
                      bgGradient: "linear(to-l, #0ea5e9,#2563eb)",
                      position: "absolute",
                      zIndex: -1,
                      top: 0,
                      left: 0,
                    }}
                  />
                ))}
              </AvatarGroup> */}
              <Text
                fontFamily={"heading"}
                fontSize={{ base: "4xl", md: "6xl" }}
              >
                +
              </Text>
              <Flex
                align={"center"}
                justify={"center"}
                fontFamily={"heading"}
                fontSize={{ base: "sm", md: "lg" }}
                bg={"gray.800"}
                color={"white"}
                rounded={"full"}
                minWidth={useBreakpointValue({ base: "44px", md: "60px" })}
                minHeight={useBreakpointValue({ base: "44px", md: "60px" })}
                position={"relative"}
                _before={{
                  content: '""',
                  width: "full",
                  height: "full",
                  rounded: "full",
                  transform: "scale(1.125)",
                  bgGradient: "linear(to-l, #0ea5e9,#2563eb)",
                  position: "absolute",
                  zIndex: -1,
                  top: 0,
                  left: 0,
                }}
              >
                Bạn
              </Flex>
            </Stack>
          </Stack>
          <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
          >
            <Stack spacing={4}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Chào bạn
                <Text
                  as={"span"}
                  bgGradient="linear(to-l, #0ea5e9,#2563eb)"
                  bgClip="text"
                >
                  !
                </Text>
              </Heading>
              <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                We’re looking for amazing engineers just like you! Become a part
                of our rockstar engineering team and skyrocket your career!
              </Text>
            </Stack>
            <Box as={"form"}>
              <Stack spacing={4}>
                <Input
                  type="text"
                  placeholder="Tên của bạn"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Địa chỉ Email"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Input
                  placeholder="Số điện thoại"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  onChange={(e) => setNumberPhone(e.target.value)}
                />

                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Text color={"black"}>Bạn có tài khoảng chưa?</Text>

                  <Text
                    color={"blue.500"}
                    fontWeight={"bold"}
                    cursor={"pointer"}
                    _hover={{ color: "black" }}
                    onClick={goLogin}
                  >
                    Đăng nhập
                  </Text>
                </Stack>
              </Stack>
              <Button
                bgGradient="linear(to-l, #0ea5e9,#2563eb)"
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                colorScheme={"blue"}
                color={"white"}
                _hover={{
                  boxShadow: "xl",
                }}
                onClick={handleRegister}
                isLoading={isLoading}
              >
                Đăng kí
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
export default SighUp;
