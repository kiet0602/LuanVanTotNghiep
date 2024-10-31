import {
  Box,
  Flex,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GiTreeBranch } from "react-icons/gi";

const LineReviewShop = () => {
  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      bg={useColorModeValue("white", "black")}
    >
      <Flex
        justify="center"
        align="center"
        mb={2}
        color={useColorModeValue("orange.400", "yellow.100")}
      >
        <Heading
          as="h2"
          size="xl"
          fontFamily="'Allura', cursive"
          mr={2} // khoảng cách giữa tiêu đề và icon
        >
          Lý do chúng tôi ở đây
        </Heading>
        <GiTreeBranch size="1.5em" /> {/* điều chỉnh kích thước icon nếu cần */}
      </Flex>

      <Text
        lineHeight="35px"
        color={useColorModeValue("gray.600", "white")}
        fontFamily="'Playfair Display', serif"
        fontSize="md"
        maxWidth="77%"
        mx="auto"
        fontWeight="100" // Giảm độ đậm của chữ
      >
        Chúng tôi bán cây xương rồng và cây mọng nước chất lượng cao. Cho dù để
        trang trí, lọc không khí hay sinh hoạt, sứ mệnh của chúng tôi là trồng
        những cây xương rồng và loài mọng nước tốt nhất để khách hàng có thể tìm
        thấy sự hài hòa và hạnh phúc trong những đặc điểm tuyệt vời của chúng.
      </Text>
    </Box>
  );
};

export default LineReviewShop;
