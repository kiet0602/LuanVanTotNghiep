import React from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Container,
  Grid,
  GridItem,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import logo from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";

const AboutUs = () => {
  // Define color values for light and dark mode
  const bgColor = useColorModeValue("gray.50", "gray.800"); // Background color for light/dark mode
  const containerBgColor = useColorModeValue("white", "gray.700"); // Container background color
  const headingColor = useColorModeValue("teal.600", "teal.400"); // Heading color
  const subHeadingColor = useColorModeValue("teal.500", "teal.300"); // Subheading color
  const textColor = useColorModeValue("gray.800", "gray.200"); // Text color

  return (
    <Box bg={bgColor} py={10}>
      <Container
        maxW="6xl"
        bg={containerBgColor}
        p={8}
        borderRadius="lg"
        shadow="xl"
      >
        {/* Tiêu đề */}
        <Heading
          as="h1"
          textAlign="center"
          mb={8}
          fontSize="3xl"
          color={headingColor}
        >
          Giới thiệu về chúng tôi
        </Heading>

        {/* Phần lịch sử hình thành */}
        <VStack spacing={6} align="start" mb={8}>
          <Heading as="h2" fontSize="2xl" color={subHeadingColor}>
            Lịch sử hình thành
          </Heading>
          <Text fontSize="lg" color={textColor}>
            Chúng tôi bắt đầu hành trình với niềm đam mê cây cảnh mini từ năm
            <strong> 2010</strong>. Từ một cửa hàng nhỏ tại địa phương, qua hơn
            14 năm phát triển, chúng tôi đã xây dựng một thương hiệu uy tín,
            chuyên cung cấp các loại cây cảnh chất lượng cao trên toàn quốc.
          </Text>
          <Text fontSize="lg" color={textColor}>
            Ban đầu, cửa hàng được thành lập bởi{" "}
            <strong>nhóm ba người bạn</strong> yêu thiên nhiên và mong muốn lan
            tỏa nghệ thuật về cây cảnh đến với mọi người. Đến nay, chúng tôi đã
            trở thành một cộng đồng lớn với hàng nghìn khách hàng yêu cây cảnh.
          </Text>
        </VStack>

        {/* Tầm nhìn và sứ mệnh */}
        <VStack spacing={6} align="start" mb={8}>
          <Heading as="h2" fontSize="2xl" color={subHeadingColor}>
            Tầm nhìn và sứ mệnh
          </Heading>
          <Text fontSize="lg" color={textColor}>
            **Tầm nhìn:** Trở thành thương hiệu hàng đầu trong lĩnh vực cây cảnh
            mini, mang thiên nhiên đến gần hơn với cuộc sống đô thị.
          </Text>
          <Text fontSize="lg" color={textColor}>
            **Sứ mệnh:** Cung cấp cây cảnh chất lượng tốt nhất, đồng thời chia
            sẻ kiến thức chăm sóc và nghệ thuật đến cho mọi người đến mọi người.
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <GridItem>
              <Image src={logo} alt="Sứ mệnh" borderRadius="md" />
            </GridItem>
          </Grid>
        </VStack>

        {/* Giá trị cốt lõi */}
        <VStack spacing={6} align="start" mb={8}>
          <Heading as="h2" fontSize="2xl" color={subHeadingColor}>
            Giá trị cốt lõi
          </Heading>
          <Text fontSize="lg" color={textColor}>
            - **Chất lượng:** Chúng tôi cam kết mang đến những sản phẩm hoàn hảo
            nhất đến tay khách hàng.
          </Text>
          <Text fontSize="lg" color={textColor}>
            - **Đổi mới:** Luôn tìm tòi và áp dụng những kỹ thuật mới để nâng
            cao giá trị của cây cảnh mini.
          </Text>
          <Text fontSize="lg" color={textColor}>
            - **Cộng đồng:** Gắn kết những người yêu cây cảnh mini, tạo dựng một
            không gian để chia sẻ kiến thức và niềm đam mê.
          </Text>
        </VStack>

        {/* Đội ngũ chúng tôi */}
        <VStack spacing={6} align="start" mb={8}>
          <Heading as="h2" fontSize="2xl" color={subHeadingColor}>
            Đội ngũ của chúng tôi
          </Heading>
          <Text fontSize="lg" color={textColor}>
            Chúng tôi tự hào sở hữu đội ngũ nhân viên chuyên nghiệp, nhiệt tình
            và có kinh nghiệm lâu năm trong lĩnh vực chăm sóc cây cảnh. Từ những
            nghệ nhân cây cảnh với đôi bàn tay khéo léo đến các chuyên gia tư
            vấn, tất cả đều làm việc với mục tiêu duy nhất: Mang đến sự hài lòng
            cho bạn.
          </Text>
        </VStack>

        {/* Cam kết */}
        <VStack spacing={6} align="start">
          <Heading as="h2" fontSize="2xl" color={subHeadingColor}>
            Cam kết của chúng tôi
          </Heading>
          <Text fontSize="lg" color={textColor}>
            - Cây được chọn lọc kỹ lưỡng từ các giống tốt nhất.
          </Text>
          <Text fontSize="lg" color={textColor}>
            - Đóng gói và vận chuyển an toàn đến mọi miền đất nước.
          </Text>
          <Text fontSize="lg" color={textColor}>
            - Hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm không đạt yêu cầu.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default AboutUs;
