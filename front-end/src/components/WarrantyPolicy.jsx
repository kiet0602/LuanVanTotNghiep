import React from "react";
import {
  Box,
  Heading,
  Text,
  Divider,
  Container,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const WarrantyPolicy = () => {
  // Sử dụng useColorModeValue để thay đổi màu sắc dựa trên chế độ sáng/tối
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const containerBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box bg={bgColor} py={10}>
      <Container
        maxW="4xl"
        p={8}
        bg={containerBg}
        borderRadius="md"
        shadow="lg"
      >
        {/* Tiêu đề chính */}
        <Heading
          as="h1"
          fontWeight="bold"
          textAlign="center"
          mb={8}
          color={textColor}
        >
          Chính sách bảo hành
        </Heading>

        {/* Chi tiết bảo hành */}
        <VStack align="start" spacing={5}>
          <Heading
            as="h2"
            size="lg"
            fontWeight="semibold"
            mb={4}
            color={textColor}
          >
            PHẠM VI BẢO HÀNH
          </Heading>

          <Text fontSize="md" color={textColor}>
            Chúng tôi cam kết cung cấp cây cảnh mini chất lượng cao và đảm bảo
            sự hài lòng của bạn với sản phẩm. Chính sách bảo hành của chúng tôi
            áp dụng cho các vấn đề liên quan đến lỗi từ vật liệu hoặc trong quá
            trình sản xuất, khi được sử dụng đúng cách.
          </Text>

          <Heading as="h3" size="md" mt={4} mb={2} color={textColor}>
            Bảo hành áp dụng cho:
          </Heading>
          <Text fontSize="md" color={textColor}>
            - Hư hại trong quá trình vận chuyển (nếu báo cáo trong vòng 48 giờ
            sau khi nhận hàng).
          </Text>
          <Text fontSize="md" color={textColor}>
            - Lỗi sức khỏe của cây trong vòng 14 ngày kể từ khi nhận hàng.
          </Text>
          <Text fontSize="md" color={textColor}>
            - Sản phẩm giao sai hoặc thiếu trong đơn hàng.
          </Text>

          <Heading as="h3" size="md" mt={4} mb={2} color={textColor}>
            Bảo hành không áp dụng cho:
          </Heading>
          <Text fontSize="md" color={textColor}>
            - Sự hao mòn thông thường của chậu, bao bì hoặc phụ kiện đi kèm.
          </Text>
          <Text fontSize="md" color={textColor}>
            - Hư hại do chăm sóc không đúng cách, bao gồm tưới nước quá nhiều,
            thiếu nước, hoặc thiếu ánh sáng.
          </Text>
          <Text fontSize="md" color={textColor}>
            - Các vấn đề phát sinh sau thời gian bảo hành.
          </Text>

          <Heading as="h3" size="md" mt={4} mb={2} color={textColor}>
            Thời gian bảo hành:
          </Heading>
          <Text fontSize="md" color={textColor}>
            Bảo hành có hiệu lực trong vòng 14 ngày kể từ ngày bạn nhận được sản
            phẩm.
          </Text>

          <Divider my={8} />

          {/* Quy trình yêu cầu bảo hành */}
          <Heading
            as="h2"
            size="lg"
            fontWeight="semibold"
            mb={4}
            color={textColor}
          >
            CÁCH YÊU CẦU BẢO HÀNH
          </Heading>
          <Text fontSize="md" color={textColor}>
            Nếu bạn gặp phải bất kỳ vấn đề nào thuộc phạm vi bảo hành, vui lòng
            thực hiện các bước sau:
          </Text>
          <Text fontSize="md" mt={2} color={textColor}>
            1. Liên hệ với chúng tôi qua email tại <b>baohanh@bonsaimini.com</b>{" "}
            hoặc gọi đến hotline <b>+84 123 456 789</b>.
          </Text>
          <Text fontSize="md" color={textColor}>
            2. Cung cấp thông tin đơn hàng, bao gồm mã đơn hàng và mô tả chi
            tiết vấn đề.
          </Text>
          <Text fontSize="md" color={textColor}>
            3. Đính kèm hình ảnh sản phẩm bị ảnh hưởng để xác minh.
          </Text>
          <Text fontSize="md" mt={4} color={textColor}>
            Sau khi nhận được yêu cầu, chúng tôi sẽ xem xét và phản hồi trong
            vòng 3-5 ngày làm việc. Nếu được chấp nhận, chúng tôi sẽ cung cấp
            một trong các phương án sau:
          </Text>
          <Text fontSize="md" color={textColor}>
            - Thay thế sản phẩm bị lỗi.
          </Text>
          <Text fontSize="md" color={textColor}>
            - Hoàn tiền (nếu không thể thay thế).
          </Text>
          <Text fontSize="md" color={textColor}>
            - Cấp mã giảm giá cho lần mua hàng sau.
          </Text>

          <Text fontSize="md" mt={4} color={textColor}>
            Chúng tôi trân trọng sự tin tưởng của bạn và cam kết nỗ lực để đảm
            bảo sự hài lòng của bạn với sản phẩm!
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default WarrantyPolicy;
