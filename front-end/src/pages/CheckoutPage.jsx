import {
  Avatar,
  Box,
  Flex,
  Icon,
  Text,
  Heading,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  DrawerOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { AiOutlineTeam, AiOutlineHome } from "react-icons/ai";
import { BsFolder2, BsCalendarCheck } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { RiFlashlightFill } from "react-icons/ri";
import { useState } from "react"; // Import useState

const CheckoutPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState("Dashboard"); // State for selected item
  //
  // Content for each selected item
  const renderContent = () => {
    switch (selectedItem) {
      case "Dashboard":
        return (
          <Box>
            <Heading color="blue.400" fontSize="3xl">
              Dashboard
            </Heading>
            <Text fontSize="md" color="gray.500">
              This is the dashboard content.
            </Text>
          </Box>
        );
      case "Team":
        return (
          <Box>
            <Heading color="blue.400" fontSize="3xl">
              Team
            </Heading>
            <Text fontSize="md" color="gray.500">
              This is the team content.
            </Text>
          </Box>
        );
      case "Projects":
        return (
          <Box>
            <Heading color="blue.400" fontSize="3xl">
              Projects
            </Heading>
            <Text fontSize="md" color="gray.500">
              This is the projects content.
            </Text>
          </Box>
        );
      case "Calendar":
        return (
          <Box>
            <Heading color="blue.400" fontSize="3xl">
              Calendar
            </Heading>
            <Text fontSize="md" color="gray.500">
              This is the calendar content.
            </Text>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      as="section"
      bg={useColorModeValue("gray.50", "gray.700")}
      minH="100vh"
    >
      <SidebarContent
        display={{ base: "none", md: "block" }}
        setSelectedItem={setSelectedItem}
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent
            w="full"
            borderRight="none"
            setSelectedItem={setSelectedItem}
          />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          justifyContent={{ base: "space-between", md: "flex-end" }}
          w="full"
          px="4"
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="sm"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={onOpen}
            icon={<FiMenu />}
            size="md"
          />

          <Flex align="center">
            <Icon color="gray.500" as={FaBell} cursor="pointer" />
            <Avatar
              ml="4"
              size="sm"
              name="Ahmad"
              src="https://avatars2.githubusercontent.com/u/37842853?v=4"
              cursor="pointer"
            />
          </Flex>
        </Flex>

        <Box
          as="main"
          p={14}
          minH="25rem"
          bg={useColorModeValue("auto", "gray.800")}
        >
          {renderContent()} {/* Render the content based on selected item */}
        </Box>
      </Box>
    </Box>
  );
};

const SidebarContent = ({ setSelectedItem, ...props }) => (
  <Box
    as="nav"
    pos="fixed"
    top="0"
    left="0"
    zIndex="sticky"
    h="full"
    pb="10"
    overflowX="hidden"
    overflowY="auto"
    bg={useColorModeValue("white", "gray.800")}
    borderColor={useColorModeValue("inherit", "gray.700")}
    borderRightWidth="1px"
    w="60"
    {...props}
  >
    <Flex px="4" py="5" align="center">
      <Icon as={RiFlashlightFill} h={8} w={8} />
      <Text
        fontSize="2xl"
        ml="2"
        color={useColorModeValue("brand.500", "white")}
        fontWeight="semibold"
      >
        POS
      </Text>
    </Flex>
    <Flex
      direction="column"
      as="nav"
      fontSize="md"
      color="gray.600"
      aria-label="Main Navigation"
    >
      <NavItem
        icon={AiOutlineHome}
        onClick={() => setSelectedItem("Dashboard")}
      >
        Dashboard
      </NavItem>
      <NavItem icon={AiOutlineTeam} onClick={() => setSelectedItem("Team")}>
        Team
      </NavItem>
      <NavItem icon={BsFolder2} onClick={() => setSelectedItem("Projects")}>
        Projects
      </NavItem>
      <NavItem
        icon={BsCalendarCheck}
        onClick={() => setSelectedItem("Calendar")}
      >
        Calendar
      </NavItem>
    </Flex>
  </Box>
);

const NavItem = ({ icon, children, onClick }) => {
  const color = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      color={useColorModeValue("inherit", "gray.400")}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.900"),
        color: useColorModeValue("gray.900", "gray.200"),
      }}
      onClick={onClick} // Add onClick handler
    >
      {icon && <Icon mx="2" boxSize="4" _groupHover={{ color }} as={icon} />}
      {children}
    </Flex>
  );
};

export default CheckoutPage;
