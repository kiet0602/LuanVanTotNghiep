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
                mt={"40px"}
                px={"50px"}
                borderRadius={"none"}
                color={"black"}
                bg={useColorModeValue("green.50", "white")}
                mx="auto"
                fontWeight="300" // Giảm độ đậm của chữ
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
                        <Text fontSize="sm">What advantages to use?</Text>
                        <ChevronDownIcon fontSize="24px" />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <Text color="gray.600">
                          Chakra UI offers a variety of advantages including
                          ease of use, accessibility, and customization options.
                          It also provides a comprehensive set of UI components
                          and is fully compatible with React.
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
                        <Text fontSize="sm">How to start using Chakra UI?</Text>
                        <ChevronDownIcon fontSize="24px" />
                      </AccordionButton>
                      <AccordionPanel>
                        <Text color="gray.600">
                          To get started with Chakra UI, you can install it via
                          npm or yarn, and then import the components you need
                          in your project. The Chakra UI documentation is also a
                          great resource for getting started and learning more
                          about the library.
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
