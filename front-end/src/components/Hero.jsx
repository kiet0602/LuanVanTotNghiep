import React, { forwardRef } from "react";
import {
  chakra,
  Container,
  Stack,
  HStack,
  Text,
  useColorModeValue,
  Box,
  Link,
  Icon,
  Image,
  Skeleton,
  Button,
} from "@chakra-ui/react";
import { GoChevronRight } from "react-icons/go";
import { MdBolt } from "react-icons/md";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import DottedBox from "./DottedBox";

const Hero = () => {
  return (
    <Box bg={useColorModeValue("orange.100", "orange.950")}>
      {" "}
      <Container maxW="6xl" px={{ base: 6, md: 3 }} py={24}>
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent="center"
        >
          <Stack
            direction="column"
            spacing={6}
            justifyContent="center"
            maxW="480px"
          >
            <HStack
              as={Link}
              p={1}
              rounded="full"
              fontSize="sm"
              w="max-content"
            >
              <Box
                py={1}
                px={2}
                lineHeight={1}
                rounded="full"
                color="white"
                bgGradient="linear(to-l, #0ea5e9,#2563eb)"
                fontFamily="'Playfair Display', serif"
              >
                Tin mới!
              </Box>
              <HStack spacing={1} alignItems="center" justifyContent="center">
                <Text lineHeight={1}>Giống cây mới...!</Text>
                <Icon as={GoChevronRight} w={4} h={4} />
              </HStack>
            </HStack>
            <chakra.h1
              fontSize="5xl"
              lineHeight={1}
              fontWeight="bold"
              textAlign="left"
            >
              Trải nghiệm mua sắm cây kiểng <br />
              <chakra.span
                fontFamily="'Allura', cursive"
                color={useColorModeValue("green.800", "green.200")}
              >
                Ở đây!
              </chakra.span>
            </chakra.h1>

            <Text
              fontSize="1rem"
              textAlign="left"
              lineHeight="1.375"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              Chúng tôi sẽ đem lại cho bạn trãi nghiệm về vẻ đẹp của các loại
              cây kiểng cùng với đó là các kiến thức về loại cây bạn thích.
            </Text>
            <HStack
              spacing={{ base: 0, sm: 2 }}
              mb={{ base: "3rem !important", sm: 0 }}
              flexWrap="wrap"
            >
              <Button
                mt="5px"
                px="50px"
                borderRadius="none"
                bg="white"
                color="black"
                fontWeight="300"
                boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
              >
                Mua Ngay
              </Button>
            </HStack>
          </Stack>
          <Box ml={{ base: 0, md: 5 }} pos="relative">
            <DottedBox />
            <Image
              w="100%"
              h="90%"
              minW={{ base: "auto", md: "30rem" }}
              objectFit="cover"
              src={imgSenda}
              rounded="md"
              fallback={<Skeleton />}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
