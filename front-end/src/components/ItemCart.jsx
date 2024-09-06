import React from "react";
import {
  Box,
  Stack,
  VStack,
  Heading,
  Flex,
  Text,
  Image,
  useColorModeValue,
  Container,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Link,
  Button,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const ItemCart = () => {
  const companies = [
    {
      title: "Tên sản phẩm",
      alt: "company image",
      role: "Senior Software Engineer",
      skills: ["ruby", "rails", "typescript", "javascript", "react", "aws"],
      period: "2019 - Present",
      logo: "https://images.unsplash.com/photo-1570126618953-d437176e8c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
    },
    {
      title: "Tên sản phẩm",
      alt: "company image",
      role: "Senior Software Engineer",
      skills: ["ruby", "rails", "typescript", "javascript", "react", "aws"],
      period: "2019 - Present",
      logo: "https://images.unsplash.com/photo-1570126618953-d437176e8c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
    },
    {
      title: "Tên sản phẩm",
      alt: "company image",
      role: "Senior Software Engineer",
      skills: ["ruby", "rails", "typescript", "javascript", "react", "aws"],
      period: "2019 - Present",
      logo: "https://images.unsplash.com/photo-1570126618953-d437176e8c79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&auto=format&fit=crop&w=334&q=80",
    },
  ];

  const totalAmount = 36000000; // Example total amount; adjust as needed

  return (
    <Container maxW="6xl" p={{ base: 5, md: 12 }}>
      <VStack spacing={4} marginBottom={6} align="left" mx={[0, 0, 6]}>
        {companies.map(({ title, role, skills, period, logo, alt }, index) => (
          <Box
            key={index}
            px={4}
            py={5}
            borderWidth="1px"
            _hover={{ shadow: "lg" }}
            bg={useColorModeValue("white", "gray.800")}
            position="relative"
            rounded="md"
          >
            <Flex justifyContent="space-between">
              <Flex
                direction={{ base: "column", md: "row" }} // Stack vertically on small screens, horizontally on medium and up
                align="center"
                p={4}
              >
                <Image
                  rounded="full"
                  w={{ base: 12, md: 16 }} // Adjust size for different screen sizes
                  h={{ base: 12, md: 16 }}
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/150"
                  src={logo}
                  alt={alt}
                />
                <Stack
                  spacing={2}
                  pl={{ base: 0, md: 3 }}
                  align="left"
                  justify="center"
                >
                  <Heading
                    align="left"
                    fontSize={{ base: "lg", md: "xl" }} // Adjust font size for different screen sizes
                  >
                    {title}
                  </Heading>
                  <Heading
                    align="left"
                    fontSize={{ base: "sm", md: "md" }} // Adjust font size for different screen sizes
                  >
                    {role}
                  </Heading>
                </Stack>
              </Flex>
              <Stack spacing={2} pl={3} align="center" justify="center">
                <Heading fontSize="sm">Số lượng</Heading>
                <NumberInput
                  defaultValue={1}
                  min={1}
                  max={100} // Example max value; adjust based on available stock
                  size="sm"
                  maxW="150px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Stack>
              <Stack spacing={2} pl={3} align="center" justify="center">
                <Heading align="left" fontSize="sm">
                  Giá
                </Heading>
                <Heading align="left" fontSize="sm">
                  12000000VND
                </Heading>
              </Stack>
              <Stack spacing={2} pl={3} align="center" justify="center">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%" // Ensure Flex container takes full width
                  p={4}
                >
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    style={{
                      color: "#B197FC",
                      fontSize: "24px",
                      marginRight: "16px",
                    }} // Add margin to right for spacing
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: "#f01435", fontSize: "24px" }} // No margin needed if only two icons
                  />
                </Flex>
              </Stack>
            </Flex>
          </Box>
        ))}
      </VStack>
      <Link
        as={NavLink}
        to="/shop" // Your route here
        textDecoration="none"
        fontStyle="italic" // Italicize the text without using as="i"
        _hover={{
          textDecoration: "underline",
        }}
        transition="color 0.2s"
      >
        Tiếp tục mua sắm
      </Link>
      <Flex
        direction="column" // Stack items vertically
        align="flex-end"
        mt={4}
        p={4}
        rounded="md"
      >
        <Heading fontSize="lg">
          Tổng tiền:{" "}
          <Text as="span" color="red.500">
            {totalAmount.toLocaleString()}
          </Text>{" "}
          VND
        </Heading>

        <Button mt={2} width={"230px"} colorScheme="teal">
          Thanh toán
        </Button>
      </Flex>
    </Container>
  );
};

export default ItemCart;
