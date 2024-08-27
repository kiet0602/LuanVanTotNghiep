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
} from "@chakra-ui/react";
import { GoChevronRight } from "react-icons/go";
import { MdBolt } from "react-icons/md";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";
import DottedBox from "./DottedBox";

const Hero = () => {
  return (
    <Container maxW="6xl" px={{ base: 6, md: 3 }} py={24}>
      <Stack direction={{ base: "column", md: "row" }} justifyContent="center">
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
            bg={useColorModeValue("gray.300", "gray.700")}
          >
            <Box
              py={1}
              px={2}
              lineHeight={1}
              rounded="full"
              color="white"
              bgGradient="linear(to-l, #0ea5e9,#2563eb)"
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
            <chakra.span color="teal">Ở đây!</chakra.span>
          </chakra.h1>
          <Text
            fontSize="1.2rem"
            textAlign="left"
            lineHeight="1.375"
            fontWeight="400"
            color="gray.500"
          >
            Chúng tôi sẽ đem lại cho bạn trãi nghiệm về vẻ đẹp của các loại cây
            kiểng cùng với đó là các kiến thức về loại cây bạn thích.
          </Text>
          <HStack
            spacing={{ base: 0, sm: 2 }}
            mb={{ base: "3rem !important", sm: 0 }}
            flexWrap="wrap"
          >
            <chakra.button
              w={{ base: "100%", sm: "auto" }}
              h={12}
              px={6}
              color="white"
              size="lg"
              rounded="md"
              mb={{ base: 2, sm: 0 }}
              zIndex={5}
              lineHeight={1}
              bgGradient="linear(to-l, #0ea5e9,#2563eb)"
              _hover={{
                bgGradient: "linear(to-l, #0ea5e9,#2563eb)",
                opacity: 0.9,
              }}
            >
              <chakra.span> Sản phẩm khuyến mãi 💥</chakra.span>
              {/*   <Icon as={MdBolt} h={4} w={4} ml={1} /> */}
            </chakra.button>
            <Box
              d="flex"
              justifyContent="center"
              bg={useColorModeValue("white", "gray.800")}
              w={{ base: "100%", sm: "auto" }}
              border="1px solid"
              borderColor="gray.300"
              p={3}
              lineHeight={1.18}
              rounded="md"
              boxShadow="md"
              as={Link}
              zIndex={9}
            >
              Xem tất cả
            </Box>
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
  );
};

export default Hero;
