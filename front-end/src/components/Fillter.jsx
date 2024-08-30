import React from "react";
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
  VStack,
  Box,
  Flex,
} from "@chakra-ui/react";

// Sample data for categories
const categories = [
  {
    _id: "64e7a0f9d6f59b001b6a5c68",
    categoryName: "Desert Plants",
    characteristic: {
      _id: "64e7a0f9d6f59b001b6a5c60",
      name: "Common Feature",
    },
    createdAt: "2024-08-29T10:30:00.000Z",
    updatedAt: "2024-08-29T10:30:00.000Z",
  },
  {
    _id: "64e7a0f9d6f59b001b6a5c76",
    categoryName: "Cacti",
    characteristic: {
      _id: "64e7a0f9d6f59b001b6a5c60",
      name: "Common Feature",
    },
    createdAt: "2024-08-29T11:20:00.000Z",
    updatedAt: "2024-08-29T11:20:00.000Z",
  },
  {
    _id: "64e7a0f9d6f59b001b6a5c78",
    categoryName: "Succulents",
    characteristic: {
      _id: "64e7a0f9d6f59b001b6a5c60",
      name: "Common Feature",
    },
    createdAt: "2024-08-29T11:30:00.000Z",
    updatedAt: "2024-08-29T11:30:00.000Z",
  },
  {
    _id: "64e7a0f9d6f59b001b6a5c80",
    categoryName: "Flowering Plants",
    characteristic: {
      _id: "64e7a0f9d6f59b001b6a5c60",
      name: "Common Feature",
    },
    createdAt: "2024-08-29T11:40:00.000Z",
    updatedAt: "2024-08-29T11:40:00.000Z",
  },
  {
    _id: "64e7a0f9d6f59b001b6a5c82",
    categoryName: "Fern",
    characteristic: {
      _id: "64e7a0f9d6f59b001b6a5c60",
      name: "Common Feature",
    },
    createdAt: "2024-08-29T11:50:00.000Z",
    updatedAt: "2024-08-29T11:50:00.000Z",
  },
  {
    _id: "64e7a0f9d6f59b001b6a5c84",
    categoryName: "Orchids",
    characteristic: {
      _id: "64e7a0f9d6f59b001b6a5c60",
      name: "Common Feature",
    },
    createdAt: "2024-08-29T12:00:00.000Z",
    updatedAt: "2024-08-29T12:00:00.000Z",
  },
];

// Group categories by characteristic name
const groupByCharacteristic = (categories) => {
  return categories.reduce((acc, category) => {
    const key = category.characteristic.name;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(category);
    return acc;
  }, {});
};

function Fillter() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const characteristicGroups = groupByCharacteristic(categories);
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
          <DrawerHeader></DrawerHeader>
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
                    <Flex
                      wrap="wrap" // Cho phép phần tử xuống hàng khi không còn đủ chỗ
                      gap={2} // Khoảng cách giữa các phần tử (10px tương đương với 2 * 4px)
                      justify="center" // Căn giữa các phần tử trong hàng
                    >
                      {characteristicGroups[name].map((category) => (
                        <Flex
                          key={category._id}
                          p={4}
                          shadow="md"
                          borderWidth="1px"
                          flexBasis="23%" // Chiếm khoảng 1/4 chiều rộng (với padding và margin còn lại)
                          align="center"
                          justify="center"
                          direction="row"
                        >
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
