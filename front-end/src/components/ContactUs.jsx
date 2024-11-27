import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
  Stack,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon, InfoIcon } from "@chakra-ui/icons";
import { FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  // Define color values for light and dark mode
  const bgColor = useColorModeValue("gray.50", "gray.800"); // Background color for light/dark mode
  const containerBgColor = useColorModeValue("white", "gray.700"); // Container background color
  const headingColor = useColorModeValue("teal.600", "teal.400"); // Heading color
  const textColor = useColorModeValue("gray.800", "gray.200"); // Text color
  const linkColor = useColorModeValue("teal.500", "teal.300"); // Link color

  return (
    <Box bg={bgColor} py={10}>
      <Container
        maxW="container.md"
        bg={containerBgColor}
        p={8}
        borderRadius="lg"
        shadow="lg"
      >
        <Heading
          as="h1"
          size="lg"
          textAlign="center"
          mb={6}
          color={headingColor}
        >
          Liên Hệ Với Chúng Tôi
        </Heading>
        <VStack spacing={6} align="start">
          <Stack direction="row" align="center" spacing={4}>
            <Icon as={FaMapMarkerAlt} w={6} h={6} color="teal.500" />
            <Box>
              <Text fontWeight="bold" color={textColor}>
                Địa chỉ:
              </Text>
              <Text color={textColor}>
                Đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Thành phố Cần Thơ
              </Text>
            </Box>
          </Stack>

          <Stack direction="row" align="center" spacing={4}>
            <Icon as={PhoneIcon} w={6} h={6} color="teal.500" />
            <Box>
              <Text fontWeight="bold" color={textColor}>
                Số điện thoại:
              </Text>
              <Text color={textColor}>0358704733</Text>
            </Box>
          </Stack>

          <Stack direction="row" align="center" spacing={4}>
            <Icon as={EmailIcon} w={6} h={6} color="teal.500" />
            <Box>
              <Text fontWeight="bold" color={textColor}>
                Email:
              </Text>
              <Link
                href="mailto:contact@example.com"
                color={linkColor}
                isExternal
              >
                kietb2003838@gmail.com
              </Link>
            </Box>
          </Stack>

          <Stack direction="row" align="center" spacing={4}>
            <Icon as={InfoIcon} w={6} h={6} color="teal.500" />
            <Box>
              <Text fontWeight="bold" color={textColor}>
                Thời gian làm việc:
              </Text>
              <Text color={textColor}>Thứ 2 - Thứ 6: 9:00 - 18:00</Text>
              <Text color={textColor}>Thứ 7: 9:00 - 13:00</Text>
            </Box>
          </Stack>
        </VStack>

        <Divider my={6} />

        <Box textAlign="center">
          <Text color={textColor}>
            Cảm ơn bạn đã liên hệ! Hãy gửi email hoặc gọi điện cho chúng tôi để
            nhận được hỗ trợ tốt nhất.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactUs;
