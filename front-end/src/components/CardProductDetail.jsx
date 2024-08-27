import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import { useState } from "react";

const CardProductDetail = () => {
  const products = [
    {
      name: "Miniature Bonsai Tree",
      price: "45.00 USD",
      description:
        "Bring a touch of nature to your home with this exquisite miniature bonsai tree.",
      details:
        "This bonsai is perfect for beginners and experienced growers alike. It's easy to care for and adds a serene atmosphere to any room.",
      features: {
        general: ["Indoor Plant", "Easy Maintenance", "Decorative"],
        special: ["Pot Included", "Ideal for Gifting", "Evergreen"],
      },
      mainImage:
        "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080",
      images: [
        "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080",
        "https://bit.ly/dan-abramov",
        "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080",
        "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080",
      ],
    },
    // Additional products can be added here
  ];
  const [mainImage, setMainImage] = useState(products[0].mainImage);
  return (
    <>
      <Container maxW={"7xl"}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}
        >
          <Stack spacing={4}>
            {/* Main Product Image */}
            <Flex>
              <Image
                rounded={"md"}
                alt={"product image"}
                src={mainImage}
                fit={"cover"}
                align={"center"}
                w={"100%"}
                h={{ base: "100%", sm: "400px", lg: "500px" }}
              />
            </Flex>

            {/* Small Images Row */}
            <SimpleGrid columns={4} spacing={4}>
              {products[0].images.map((image, index) => (
                <Image
                  key={index}
                  rounded={"md"}
                  alt={"product image"}
                  src={image}
                  fit={"cover"}
                  h={"100px"}
                  onClick={() => setMainImage(image)}
                  cursor={"pointer"}
                />
              ))}
            </SimpleGrid>
          </Stack>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={"header"}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {products[0].name}
              </Heading>
              <Text
                color={useColorModeValue("gray.900", "gray.400")}
                fontWeight={300}
                fontSize={"2xl"}
              >
                ${products[0].price}
              </Text>
            </Box>

            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              divider={
                <StackDivider
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                />
              }
            >
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={useColorModeValue("gray.500", "gray.400")}
                  fontSize={"2xl"}
                  fontWeight={"300"}
                >
                  {products[0].description}
                </Text>
                <Text fontSize={"lg"}>{products[0].details}</Text>
              </VStack>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color={useColorModeValue("green.500", "green.300")}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  Features
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                  {Object.entries(products[0].features).map(
                    ([category, features], index) => (
                      <List spacing={2} key={index}>
                        {features.map((feature, index) => (
                          <ListItem key={index}>{feature}</ListItem>
                        ))}
                      </List>
                    )
                  )}
                </SimpleGrid>
              </Box>
            </Stack>

            <Button
              rounded={"none"}
              w={"full"}
              mt={8}
              size={"lg"}
              py={"7"}
              bg={useColorModeValue("green.900", "green.50")}
              color={useColorModeValue("white", "green.900")}
              textTransform={"uppercase"}
              _hover={{
                transform: "translateY(2px)",
                boxShadow: "lg",
              }}
            >
              Add to cart
            </Button>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"center"}
            >
              <MdLocalShipping />
              <Text>2-3 business days delivery</Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default CardProductDetail;
