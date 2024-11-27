import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Divider,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const ReturnShipping = () => {
  // Define color values for light and dark mode
  const bgColor = useColorModeValue("gray.50", "gray.800"); // Background color for light/dark mode
  const containerBgColor = useColorModeValue("white", "gray.700"); // Container background color
  const headingColor = useColorModeValue("teal.600", "teal.400"); // Heading color
  const textColor = useColorModeValue("gray.800", "gray.200"); // Text color

  return (
    <Box bg={bgColor} py={10}>
      <Container
        maxW="4xl"
        p={8}
        bg={containerBgColor}
        borderRadius="md"
        shadow="lg"
      >
        {/* Tiêu đề chính */}
        <Heading
          as="h1"
          fontWeight="bold"
          textAlign="center"
          mb={8}
          color={headingColor}
        >
          Giao Hàng & Đổi Trả
        </Heading>

        {/* Giao Hàng */}
        <VStack align="start" spacing={5}>
          <Heading
            as="h2"
            size="lg"
            fontWeight="semibold"
            mb={4}
            color={headingColor}
          >
            GIAO HÀNG
          </Heading>

          <Box>
            <Heading as="h3" size="md" mt={4} mb={2} color={headingColor}>
              Khi nào:
            </Heading>
            <Text fontSize="md" color={textColor}>
              Chúng tôi giao hàng từ thứ 2 đến thứ 6 hàng tuần. Thời gian giao
              hàng có thể thay đổi tùy thuộc vào khu vực và điều kiện thời tiết.
            </Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mt={4} mb={2} color={headingColor}>
              Cách thức:
            </Heading>
            <Text fontSize="md" color={textColor}>
              Chúng tôi sử dụng dịch vụ vận chuyển uy tín để đảm bảo sản phẩm
              đến tay khách hàng một cách an toàn. Hiện tại, chúng tôi chỉ giao
              hàng trong nội địa Việt Nam.
            </Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mt={4} mb={2} color={headingColor}>
              Đóng gói:
            </Heading>
            <Text fontSize="md" color={textColor}>
              Tất cả sản phẩm đều được đóng gói cẩn thận, đảm bảo giữ nguyên
              trạng trong quá trình vận chuyển. Cây bonsai sẽ được bọc gốc và
              bảo vệ bằng chất liệu chuyên dụng.
            </Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mt={4} mb={2} color={headingColor}>
              Thời gian xử lý đơn hàng:
            </Heading>
            <Text fontSize="md" color={textColor}>
              Vui lòng cho phép 1-3 ngày làm việc để đơn hàng của bạn được xử
              lý. Chúng tôi cần thời gian để chuẩn bị, đóng gói và sắp xếp vận
              chuyển. Trong các dịp khuyến mãi lớn, thời gian xử lý có thể kéo
              dài thêm do số lượng đơn hàng tăng cao.
            </Text>
          </Box>

          <Text fontSize="md" mt={4} color={textColor}>
            Cảm ơn bạn đã tin tưởng và kiên nhẫn. Chúng tôi cam kết mang đến
            trải nghiệm mua sắm tốt nhất!
          </Text>
        </VStack>

        <Divider my={8} />

        {/* Đổi Trả */}
        <VStack align="start" spacing={5}>
          <Heading
            as="h2"
            size="lg"
            fontWeight="semibold"
            mb={4}
            color={headingColor}
          >
            ĐỔI TRẢ
          </Heading>

          <Text fontSize="md" color={textColor}>
            Chúng tôi chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng.
            Để đảm bảo quyền lợi của bạn, sản phẩm cần được giữ nguyên tình
            trạng ban đầu, bao gồm cả bao bì và các phụ kiện đi kèm.
          </Text>

          <Text fontSize="md" color={textColor}>
            Nếu sản phẩm bị lỗi do vận chuyển hoặc không đúng mô tả, vui lòng
            liên hệ với chúng tôi ngay để được hỗ trợ. Chúng tôi cam kết đổi sản
            phẩm mới hoặc hoàn tiền nếu không thể đáp ứng yêu cầu của bạn.
          </Text>

          <Text fontSize="md" color={textColor}>
            Lưu ý: Chi phí vận chuyển cho việc đổi trả sẽ do khách hàng chịu,
            trừ trường hợp lỗi thuộc về chúng tôi.
          </Text>

          <Text fontSize="md" color={textColor}>
            Để bắt đầu quy trình đổi trả, vui lòng liên hệ bộ phận chăm sóc
            khách hàng qua email: <b>kietb2003838@gmail.com</b> hoặc gọi đến số
            hotline: <b>0358704733</b>.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default ReturnShipping;
