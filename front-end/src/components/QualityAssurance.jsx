import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const QualityAssurance = () => {
  // Define color values for light and dark mode
  const bgColor = useColorModeValue("gray.50", "gray.800"); // Background color for light/dark mode
  const containerBgColor = useColorModeValue("white", "gray.700"); // Container background color
  const headingColor = useColorModeValue("teal.600", "teal.400"); // Heading color
  const textColor = useColorModeValue("gray.800", "gray.200"); // Text color

  return (
    <Box bg={bgColor} py={10}>
      <Container
        maxW="5xl"
        bg={containerBgColor}
        p={8}
        borderRadius="lg"
        shadow="xl"
      >
        <Heading
          as="h1"
          textAlign="center"
          mb={8}
          fontSize="3xl"
          color={headingColor}
        >
          Đảm bảo chất lượng
        </Heading>
        <VStack spacing={6} align="start">
          <Text fontSize="lg" color={textColor}>
            Chất lượng sản phẩm là ưu tiên hàng đầu của chúng tôi. Mỗi cây đều
            được kiểm tra kỹ lưỡng để đảm bảo bạn nhận được sản phẩm tốt nhất.
          </Text>
          <Heading as="h2" fontSize="xl" color={headingColor}>
            Quy trình kiểm tra:
          </Heading>
          <Text fontSize="md" color={textColor}>
            - Chọn lọc từ những giống cây khỏe mạnh, hình dáng đẹp.
            <br />
            - Kiểm tra cây trước khi đóng gói để đảm bảo không bị hư hại.
            <br />- Đóng gói cẩn thận để giữ cây an toàn khi vận chuyển.
          </Text>

          <Heading as="h2" fontSize="xl" color={headingColor}>
            Cam kết của chúng tôi:
          </Heading>
          <Text fontSize="md" color={textColor}>
            Nếu có vấn đề về chất lượng sản phẩm, hãy liên hệ ngay với chúng tôi
            để được hỗ trợ và đổi trả trong vòng 7 ngày.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default QualityAssurance;
