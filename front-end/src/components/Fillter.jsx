import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Divider,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import imgSenda from "../assets/data/image/Senda/sen-da-chuoi-ngoc-dung.jpg";

function Fillter() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh mục
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2000/api/category/getAllCategory"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleMouseEnter = () => {
    onOpen();
  };

  return (
    <>
      <Text cursor={"pointer"} onClick={handleMouseEnter}>
        Loại
      </Text>
      <Drawer placement={"top"} onClose={onClose} isOpen={isOpen} size={"lg"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                <Flex gap={2} alignItems="center">
                  <Image
                    borderRadius={"20px"}
                    src={imgSenda}
                    alt=""
                    h={8}
                    w={8}
                  />
                  <Text
                    cursor={"pointer"}
                    bgGradient="linear(to-l, #0ea5e9, #2563eb)" // Linear gradient from right to left
                    bgClip="text" // Clips the background to the text
                    fontSize="20px" // Example font size
                    fontWeight="bold"
                    as="i"
                  >
                    Plant Paradise
                  </Text>
                </Flex>
              </TabList>
              <Divider marginTop={"20px"} />
              <TabPanels>
                <TabPanel>
                  <Flex wrap="wrap" gap={2} justify="center">
                    {categories.map((category) => (
                      <NavLink
                        key={category._id}
                        to={`/category/${category._id}`} // Đường dẫn đến trang sản phẩm của danh mục
                        onClick={onClose} // Tắt TabPanel sau khi click
                      >
                        <Flex
                          p={4}
                          shadow="md"
                          borderWidth="1px"
                          flexBasis="23%"
                          align="center"
                          justify="center"
                          direction="column"
                        >
                          <Image
                            src={`http://localhost:2000/images/${category.imageCategory}`} // Đường dẫn tới hình ảnh
                            alt={category.categoryName}
                            boxSize="100px"
                            objectFit="cover"
                            mb={2}
                            borderRadius={"10px"}
                          />
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            textAlign="center" // Căn giữa chữ trong Text
                          >
                            {category.categoryName}
                          </Text>
                        </Flex>
                      </NavLink>
                    ))}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Fillter;
