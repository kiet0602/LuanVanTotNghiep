import React from "react";
import {
  Text,
  SimpleGrid,
  Box,
  Image,
  Flex,
  Stack,
  Container,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import ImageIntroduceShop from "../assets/data/image/Senda/Who_We_Are_2160x.jpg";

const IntroduceShop = () => {
  return (
    <Box bg={useColorModeValue("teal.50", "teal.800")}>
      {" "}
      <Container maxW="7xl">
        {" "}
        <Stack minH="60vh" py="60px" direction={{ base: "column", md: "row" }}>
          <Flex flex={1}>
            <Image
              alt="Cover image"
              objectFit="cover"
              src={ImageIntroduceShop}
            />
          </Flex>
          <Flex p={8} flex={1} align="center" justifyContent="center">
            <Flex direction="column">
              <Text
                fontWeight="extrabold"
                fontSize="40px"
                pb={"30px"}
                fontFamily="'Playfair Display', serif"
              >
                <Flex justify="center" align="center" pb="20px">
                  <Box
                    fontFamily="'Allura', cursive"
                    color={useColorModeValue("gray.500", "green.200")}
                    display="inline-block"
                    position="relative"
                    textAlign="center"
                    fontSize={"60px"}
                    letterSpacing="3px" // Tạo khoảng cách giữa các chữ
                  >
                    Chúng Tôi Là Ai?
                    <Box
                      as="span"
                      display="block"
                      position="absolute"
                      bg="gray.300"
                      w="100%"
                      h="1px"
                      bottom={-1} // canh đúng vị trí dưới dòng chữ
                      left={0}
                    />
                  </Box>
                </Flex>
              </Text>
              <Text lineHeight="35px">
                Plant Paradise là trang trại xương rồng và mọng nước thế hệ thứ
                ba. Chúng tôi đã trồng xương rồng sống và các loài mọng nước
                trong hơn 50 năm. Giờ đây, chúng tôi cung cấp cho bạn khả năng
                đặt hàng nhiều loại xương rồng và mọng nước để bán trực tuyến!
                Với Plant Paradise, hãy mua các loại mọng nước trực tuyến ngay
                tại nhà của bạn một cách thoải mái. Hái và chọn từ hơn 100 loại
                xương rồng và mọng nước khác nhau để bán. Cuối cùng, việc tìm
                kiếm cửa hàng mọng nước tuyệt đỉnh của bạn đã kết thúc! Đáp ứng
                mọi nhu cầu làm vườn của bạn và trở thành bậc cha mẹ thực vật
                đáng tự hào với Plant Paradise!
              </Text>
              {/* <SimpleGrid
            columns={{ base: 2, sm: 3, md: 3 }}
            spacing={1}
            mt={12}
            mb={4}
          >
            {statData.map((data) => (
              <Box key={data.id} p={{ base: 2, sm: 5 }} textAlign="center">
                <Text fontWeight="extrabold" fontSize="xx-large">
                  {data.score}
                </Text>
                <Text fontSize="sm">{data.label}</Text>
              </Box>
            ))}
          </SimpleGrid> */}
              <Button
                mt={"40px"}
                px={"50px"}
                borderRadius={"none"}
                color={"black"}
                bg={useColorModeValue("white", "green.50")}
                mx="auto"
                fontWeight="300" // Giảm độ đậm của chữ
              >
                Cửa hàng của chúng tôi
              </Button>
            </Flex>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default IntroduceShop;
