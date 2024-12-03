import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Flex,
  useColorModeValue,
  Text,
  SimpleGrid,
  Box,
  Image,
  Stack,
  Container,
  Button,
} from "@chakra-ui/react";
import ImageIntroduceShop from "../assets/data/image/Senda/Who_We_Are_2160x.jpg";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";

const IntroduceShop = () => {
  return (
    <Box bg={useColorModeValue("teal.50", "teal.900")}>
      {" "}
      <Container maxW="7xl">
        {" "}
        <Stack minH="60vh" py="60px" direction={{ base: "column", md: "row" }}>
          <Flex flex={1}>
            <Image
              // alt="Cover image"
              objectFit="cover"
              width="100%" // đảm bảo ảnh không bị kéo dài
              src={ImageIntroduceShop}
              height="auto" // điều chỉnh chiều cao tự động dựa trên chiều rộng
              maxHeight="500px" // giới hạn chiều cao tối đa, có thể thay đổi tùy theo thiết kế
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
                as={NavLink} // Đặt nút làm NavLink
                to="/aboutUs"
                mt="40px"
                px="50px"
                borderRadius="none"
                color="black"
                bg={useColorModeValue("green.50", "white")}
                mx="auto"
                fontWeight="300"
              >
                Cửa hàng của chúng tôi
              </Button>
              <Flex
                mt={"30px"}
                align={"center"}
                justify={"center"}
                bg={useColorModeValue("teal.50", "teal.900")}
              >
                <Container>
                  <Accordion
                    allowMultiple
                    width="100%"
                    maxW="full"
                    rounded="lg"
                  >
                    <AccordionItem>
                      <AccordionButton
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        p={4}
                      >
                        <Text fontSize="sm">
                          Cây này có phù hợp để đặt ở ban công hoặc sân vườn
                          không?
                        </Text>
                        <ChevronDownIcon fontSize="24px" />
                      </AccordionButton>
                      <AccordionPanel>
                        <Text color="gray.600">
                          Có, cây phù hợp cho cả ban công và sân vườn nếu có ánh
                          sáng tự nhiên vừa phải.
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <AccordionButton
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        p={4}
                      >
                        <Text fontSize="sm">
                          Lợi ích khi sử dụng cây cảnh mini là gì?
                        </Text>
                        <ChevronDownIcon fontSize="24px" />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <Text color="gray.600">
                          Cây cảnh mini không chỉ giúp làm đẹp không gian sống
                          mà còn cải thiện chất lượng không khí, giảm căng thẳng
                          và tạo cảm giác thư thái. Chúng cũng rất dễ chăm sóc
                          và phù hợp với nhiều loại không gian.
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem>
                      <AccordionButton
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        p={4}
                      >
                        <Text fontSize="sm">
                          Làm thế nào để bắt đầu chơi cây cảnh mini?
                        </Text>
                        <ChevronDownIcon fontSize="24px" />
                      </AccordionButton>
                      <AccordionPanel>
                        <Text color="gray.600">
                          Để bắt đầu, bạn có thể chọn loại cây cảnh mini phù hợp
                          với không gian và phong cách của mình. Hãy tìm hiểu về
                          cách chăm sóc từng loại cây, bao gồm ánh sáng, nước,
                          và đất trồng. Bạn cũng có thể tham khảo các hướng dẫn
                          chi tiết trên website hoặc tham gia cộng đồng yêu cây
                          cảnh để học hỏi thêm kinh nghiệm.
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Container>
              </Flex>
            </Flex>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default IntroduceShop;
