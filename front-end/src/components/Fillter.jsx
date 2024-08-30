import React, { useState, useEffect } from "react";
import {
  Button,
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
  Box,
} from "@chakra-ui/react";
import axios from "axios";

// Component để hiển thị danh mục
function Fillter() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState([]);
  const [characteristicGroups, setCharacteristicGroups] = useState({});

  useEffect(() => {
    // Gọi API để lấy danh mục
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2000/api/category/getAllCategory"
        );
        const data = response.data;

        // Cập nhật danh mục
        setCategories(data);

        // Nhóm danh mục theo đặc điểm
        const grouped = groupByCharacteristic(data);
        setCharacteristicGroups(grouped);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  // Nhóm danh mục theo tên đặc điểm
  const groupByCharacteristic = (categories) => {
    return categories.reduce((acc, category) => {
      const key = category.characteristic.characteristicName;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(category);
      return acc;
    }, {});
  };

  const characteristicNames = Object.keys(characteristicGroups);
  const handleMouseEnter = () => {
    onOpen();
  };

  return (
    <>
      <Text cursor={"pointer"} onClick={handleMouseEnter}>
        Loại cây
      </Text>
      <Drawer placement={"top"} onClose={onClose} isOpen={isOpen} size={"lg"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Loại</DrawerHeader>
          <DrawerBody>
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                {characteristicNames.map((name, index) => (
                  <Tab key={index}>{name}</Tab>
                ))}
              </TabList>
              <Divider marginTop={"20px"} />
              <TabPanels>
                {characteristicNames.map((name, index) => (
                  <TabPanel key={index}>
                    <Flex wrap="wrap" gap={2} justify="center">
                      {characteristicGroups[name].map((category) => (
                        <Flex
                          key={category._id}
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
                          />
                          <Text fontWeight="bold" fontSize="lg">
                            {category.categoryName}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Fillter;
