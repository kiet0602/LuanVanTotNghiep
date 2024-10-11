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

function Filter() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [selectedClassification, setSelectedClassification] = useState("");

  useEffect(() => {
    // Gọi API để lấy danh mục phân loại
    const fetchClassifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2000/api/classification/getAllClassifications"
        );
        setClassifications(response.data);
        setSelectedClassification(response.data[0]._id);
      } catch (error) {
        console.error("Error fetching classifications:", error.message);
      }
    };

    fetchClassifications();
  }, []);

  useEffect(() => {
    if (selectedClassification && selectedClassification !== "invalid_id") {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(
            `http://localhost:2000/api/category/getCategoriesByClassification/${selectedClassification}`
          );
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching categories:", error.message);
          // Có thể thêm thông báo lỗi cho người dùng hoặc thông báo cho quản trị viên
          setCategories([]); // Xóa danh mục nếu có lỗi để tránh hiển thị dữ liệu lỗi
        }
      };
      fetchCategories();
    }
  }, [selectedClassification]);

  const handleTabChange = (index) => {
    const classification = classifications[index];
    setSelectedClassification(classification._id);
  };

  const handleMouseEnter = () => {
    onOpen();
  };
  const handleMouseExit = () => {
    onClose();
    setSelectedClassification(response.data[0]._id);
  };

  return (
    <>
      <Text cursor={"pointer"} fontWeight="semibold" onClick={handleMouseEnter}>
        Loại
      </Text>
      <Drawer placement={"top"} onClose={onClose} isOpen={isOpen} size={"lg"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex gap={2} alignItems="center">
              <Image borderRadius={"20px"} src={imgSenda} alt="" h={8} w={8} />
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
          </DrawerHeader>
          <DrawerBody>
            <Tabs
              variant="soft-rounded"
              colorScheme="green"
              onChange={(index) => handleTabChange(index)} // Đổi phân loại khi tab thay đổi
            >
              <TabList>
                {classifications.length > 0 ? (
                  classifications.map((classification, index) => (
                    <Tab
                      key={classification._id}
                      onClick={() => handleTabChange(index)}
                    >
                      {classification.classificationName}
                    </Tab>
                  ))
                ) : (
                  <Tab>No classifications available</Tab>
                )}
              </TabList>
              <Divider marginTop={"20px"} />
              <TabPanels>
                {classifications.length > 0 ? (
                  classifications.map((classification, index) => (
                    <TabPanel key={classification._id}>
                      {selectedClassification === classification._id ? (
                        <Flex wrap="wrap" gap={2} justify="center">
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <NavLink
                                key={category._id}
                                to={`/category/${category._id}`} // Đường dẫn đến trang sản phẩm của danh mục
                                onClick={handleMouseExit} // Tắt TabPanel sau khi click
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
                            ))
                          ) : (
                            <Text>
                              Không có danh mục nào cho phân loại này.
                            </Text>
                          )}
                        </Flex>
                      ) : null}
                    </TabPanel>
                  ))
                ) : (
                  <TabPanel>
                    <Text>Không có phân loại nào.</Text>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Filter;
