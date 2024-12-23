import React from "react";
import {
  Flex,
  Link,
  Text,
  Container,
  VStack,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { footerData } from "../assets/data/datalink/datalink.js";

const Footer = () => {
  const bgColor = useColorModeValue("white", "black");
  const textColor = useColorModeValue("gray.800", "gray.300");
  return (
    <Box bg={bgColor} py={5}>
      <Container maxW="7xl" p={{ base: 5, md: 10 }}>
        <VStack spacing={5} alignItems="initial">
          <Flex
            flexWrap="wrap"
            direction={{ base: "column", md: "row" }}
            alignItems="start"
            justifyContent="space-between"
          >
            {footerData.map((data, index) => (
              <Flex key={index} direction="column" mb="3">
                <Link fontWeight="500" href={data.href} color={textColor}>
                  {data.label}
                </Link>
                <Flex direction={{ base: "row", md: "column" }}>
                  {data.links.map((link, index) => (
                    <Link
                      key={index}
                      padding={1}
                      fontSize={{ base: "sm", sm: "md" }}
                      href="#"
                      mr={{ base: 1, sm: 2, md: 0 }}
                      color="gray.500"
                      _hover={{ color: "blue.600" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Flex>
              </Flex>
            ))}
          </Flex>
          <Flex alignItems="center">
            <Text color="gray.500" fontSize="0.875rem" pl="0.5rem">
              &copy; 2019 company, Inc. All rights reserved.
            </Text>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;
