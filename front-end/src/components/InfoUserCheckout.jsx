import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

const userData = localStorage.getItem("userCurrent");
const userCurrent = userData ? JSON.parse(userData) : null;
console.log(userCurrent);

const InfoUserCheckout = () => {
  return (
    <VStack w="full" h="full" p={10} spacing={10} align="flex-start">
      <VStack spacing={2} align="flex-start">
        <Heading>Thông tin giao hàng!</Heading>
        <Text>Thông tin của bạn</Text>
      </VStack>
      <SimpleGrid columns={2} columnGap={3} rowGap={4}>
        <GridItem colSpan={1}>
          <Box>
            <Text fontSize="xl" color="blue.500">
              Tên của bạn: {userCurrent?.username}
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input placeholder="Enter Last Name " />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Textarea placeholder="Enter Your Address... " />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>City</FormLabel>
            <Input placeholder="Enter City " />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Country </FormLabel>
            <Select placeholder="Select Country">
              <option value="india">India</option>
            </Select>
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <Checkbox>Ship to the billing address.</Checkbox>
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <Button variant="primary" width="full" size="lg">
            Place Items
          </Button>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default InfoUserCheckout;
