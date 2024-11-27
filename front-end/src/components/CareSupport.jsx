import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const CareSupport = () => {
  // Define color values for light and dark mode
  const bgColor = useColorModeValue("gray.50", "gray.800"); // Background color for light/dark mode
  const containerBgColor = useColorModeValue("white", "gray.700"); // Container background color
  const headingColor = useColorModeValue("teal.600", "teal.400"); // Heading color
  const textColor = useColorModeValue("gray.800", "gray.200"); // Text color
  const linkColor = useColorModeValue("teal.500", "teal.300"); // Link color

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
          Hỗ trợ chăm sóc cây
        </Heading>
        <VStack spacing={6} align="start">
          <Text fontSize="lg" color={textColor}>
            Chúng tôi mang đến hướng dẫn chi tiết để giúp bạn chăm sóc cây cảnh
            mini tốt nhất. Hãy tham khảo các mẹo dưới đây để cây luôn khỏe mạnh
            và tươi tốt.
          </Text>
          <Heading as="h2" fontSize="xl" color={headingColor}>
            Mẹo chăm sóc cơ bản:
          </Heading>
          <Text fontSize="md" color={textColor}>
            - Tưới nước khi đất khô, không để cây bị ngập úng.
            <br />
            - Đảm bảo ánh sáng đầy đủ, tránh ánh nắng trực tiếp quá mạnh.
            <br />- Bón phân đều đặn bằng loại phân chuyên dụng cho cây bonsai.
          </Text>

          <Heading as="h2" fontSize="xl" color={headingColor}>
            Hỗ trợ khách hàng:
          </Heading>
          <Text fontSize="md" color={textColor}>
            Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn. Liên hệ qua:
            <b> support@bonsaimini.com</b> hoặc hotline: <b>+84 123 456 789</b>.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default CareSupport;
