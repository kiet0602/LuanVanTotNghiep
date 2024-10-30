import React, { forwardRef } from "react";
import {
  Container,
  Box,
  chakra,
  Text,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FaCheckCircle,
  FaHandsHelping,
  FaSeedling,
  FaTruck,
} from "react-icons/fa";
import { color } from "framer-motion";

const features = [
  {
    heading: "Bảo hành cây trong 30 ngày",
    content:
      "Chúng tôi cam kết bảo hành 30 ngày để bạn hoàn toàn yên tâm khi chọn mua sản phẩm.",
    icon: FaSeedling,
    color: { light: "green.500", dark: "green.200" }, // Màu cho useColorModeValue
  },
  {
    heading: "Chất lượng đảm bảo",
    content: `Chúng tôi cam kết chất lượng đảm bảo, mang đến sự hài lòng tuyệt đối cho bạn.`,
    icon: FaCheckCircle,
    color: { light: "green.300", dark: "green.200" }, // Màu cho useColorModeValue
  },
  {
    heading: "Hỗ trợ chăm sóc cây",
    content: "Chúng tôi luôn sẵn sàng hỗ trợ bạn trong việc chăm sóc cây.",
    icon: FaHandsHelping,
    color: { light: "teal.400", dark: "teal.100" },
  },
  {
    heading: "Giao hàng tận nơi",
    content: `Dịch vụ giao hàng tận nơi giúp bạn nhận cây một cách thuận tiện nhất.`,
    icon: FaTruck,
    color: { light: "blue.400", dark: "blue.200" },
  },
];

const Features = () => {
  return (
    <>
      <Box bg={useColorModeValue("orange.50", "orange.950")}>
        <Container maxW="6xl" p={{ base: 5, md: 10 }}>
          <chakra.h3
            fontFamily="'Playfair Display', serif"
            fontSize="4xl"
            fontWeight="bold"
            mb={3}
            textAlign="center"
            letterSpacing="3px" // Tạo khoảng cách giữa các chữ
          >
            Tại sao chọn chúng tôi?
          </chakra.h3>
          <Text fontSize="lg" mb={5} lineHeight="35px">
            Chất lượng sản phẩm luôn là ưu tiên hàng đầu của chúng tôi. Các sản
            phẩm được chọn lựa kỹ lưỡng từ những giống cây tốt nhất, đảm bảo mỗi
            sản phẩm đến tay bạn đều trong trạng thái hoàn hảo và lâu bền.
          </Text>
          <Text fontSize="lg" mb={5} lineHeight="35px">
            Chúng tôi hiểu rằng mỗi khách hàng đều cần sự hỗ trợ riêng biệt, vì
            vậy đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và tư vấn cho bạn
            từ việc chọn lựa đến chăm sóc cây tại nhà. Sự hài lòng của bạn là
            niềm vui của chúng tôi.
          </Text>
          <Text fontSize="lg" mb={5} lineHeight="35px">
            Với dịch vụ giao hàng tận nơi, chúng tôi cam kết mang đến trải
            nghiệm mua sắm tiện lợi và nhanh chóng. Bạn có thể yên tâm nhận sản
            phẩm tại nhà trong thời gian ngắn nhất mà vẫn đảm bảo an toàn và
            chất lượng.
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            placeItems="center"
            spacing={16}
            mt={12}
            mb={4}
          >
            {features.map((feature, index) => (
              <Box key={index} textAlign="center">
                <Icon
                  as={feature.icon}
                  w={10}
                  h={10}
                  color={useColorModeValue(
                    feature.color.light,
                    feature.color.dark
                  )}
                />
                <chakra.h3
                  fontWeight="semibold"
                  fontSize="2xl"
                  fontFamily="'Playfair Display', serif"
                >
                  {feature.heading}
                </chakra.h3>
                <Text fontSize="md">{feature.content}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
};

export default Features;
