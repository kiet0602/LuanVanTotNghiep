"use client";

import {
  Box,
  chakra,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Input,
  IconButton,
  useColorModeValue,
  Flex,
  Image,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import useNavigateCustom from "../Hook/useNavigateCustom.js";
import { Link } from "react-router-dom";

const Logo = ({ props }) => {
  const { goHome } = useNavigateCustom();
  return (
    <Flex gap={1} onClick={goHome} cursor={"pointer"}>
      <Image borderRadius={"20px"} src={imgSenda} alt="" h={8} w={8} />
      <Text
        fontFamily="'Allura', cursive"
        pr={10}
        fontWeight="bold"
        fontSize={"30px"} // Thêm 'px' để xác định đơn vị
        color={useColorModeValue("green.800", "green.200")}
      >
        Plant Paradise
      </Text>
    </Flex>
  );
};

const SocialButton = ({ children, label, href }) => (
  <chakra.button
    bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
    rounded="full"
    w={8}
    h={8}
    cursor="pointer"
    as="a"
    href={href}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    transition="background 0.3s ease"
    _hover={{
      bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
    }}
  >
    <VisuallyHidden>{label}</VisuallyHidden>
    {children}
  </chakra.button>
);

const ListHeader = ({ children }) => (
  <Text fontWeight="500" fontSize="lg" mb={2}>
    {children}
  </Text>
);

export default function Footter() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container as={Stack} maxW={"7xl"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Logo color={useColorModeValue("gray.700", "white")} />
            </Box>
            <Text fontSize={"sm"}>© 2024 Luận văn tốt nghiệp.</Text>
            <Stack direction={"row"} spacing={6}>
              <SocialButton label={"Twitter"} href={"#"}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={"YouTube"} href={"#"}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={"Instagram"} href={"#"}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Cửa hàng</ListHeader>
            <Box as="a" href={"#"}>
              Về chúng tôi
            </Box>

            <Box as="a" href={"#"}>
              Liên hệ với chúng tôi
            </Box>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Hỗ trợ</ListHeader>
            <Box as="a" href={"#"}>
              Chính sách bảo hành
            </Box>
            <Box as="a" href={"#"}>
              Đảm bảo chất lượng
            </Box>
            <Box as="a" href={"#"}>
              Hỗ trợ chăm sóc
            </Box>
            <Box as={Link} to="/returnShiping">
              Giao hàng
            </Box>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Người tạo dự án:</ListHeader>
            <Text>Nguyễn Văn Kiệt</Text>
            <Text>Mã số sinh viên: B2003838</Text>
            <Text>Nhóm: ....</Text>

            <Stack direction={"row"}></Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
