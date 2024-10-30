import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";

const TitlleCustom = ({ title, description }) => {
  // Use useColorModeValue to switch between light and dark modes
  const bgColor = useColorModeValue("whiteAlpha.800", "blackAlpha.800"); // Background overlay color
  const textColor = useColorModeValue("black", "white"); // Text color

  return (
    <Box
      my={2}
      bgImg={imgSenda}
      bgSize="cover"
      bgPosition="center"
      width="100%"
      maxW="100%"
      _before={{
        content: `""`,
        bg: bgColor,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        opacity: 0.6, // Overlay opacity
      }}
      position="relative"
      zIndex={1}
    >
      <Container
        maxW="6xl"
        p={{ base: 5, md: 10 }}
        position="relative"
        zIndex={2}
      >
        <Heading
          fontFamily="'Allura', cursive"
          as="h3"
          fontWeight="bold"
          textAlign="center"
          mb={{ base: "4", md: "2" }}
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.4)"
          textTransform="uppercase"
          size="xl"
        >
          {title}
        </Heading>
        <Text
          fontFamily="'Playfair Display', serif"
          fontWeight={"bold"}
          fontStyle="italic" // Chữ nghiêng
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.4)" // Đổ bóng chữ
          textAlign="center" // Căn giữa văn bản
        >
          {" "}
          {description}
        </Text>
        <Flex alignItems={{ base: "start", md: "center" }}>
          <svg
            viewBox="0 0 24 24"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            style={{ height: "24px", width: "24px" }}
          >
            {/* SVG Path */}
          </svg>
          <Text pl={2} textAlign="left"></Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default TitlleCustom;
