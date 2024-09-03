import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

const Tiltel = ({ title, imageCategory, iconColor }) => {
  // Use useColorModeValue to switch between light and dark modes
  const bgColor = useColorModeValue("whiteAlpha.800", "blackAlpha.800"); // Background overlay color
  const textColor = useColorModeValue("black", "white"); // Text color

  return (
    <Box
      bgImage={`http://localhost:2000/images/${imageCategory}`}
      bgSize="cover"
      bgPosition="center"
      width="100%"
      maxW="100%"
      borderRadius="20px"
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
          as="h3"
          size="lg"
          fontWeight="bold"
          textAlign="center"
          mb={{ base: "4", md: "2" }}
          textShadow="2px 2px 4px rgba(0, 0, 0, 0.4)"
          color={textColor}
        >
          {title}
        </Heading>

        <Flex alignItems={{ base: "start", md: "center" }}>
          <svg
            viewBox="0 0 24 24"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            style={{ height: "24px", width: "24px", fill: iconColor }}
          >
            {/* SVG Path */}
          </svg>
          <Text pl={2} textAlign="left" color={textColor}></Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Tiltel;
