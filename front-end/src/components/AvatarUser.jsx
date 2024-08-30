import {
  Avatar,
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  MenuDivider,
  useColorModeValue,
} from "@chakra-ui/react";
//thư viện
import { NavLink } from "react-router-dom";
//hooks Custom

const AvatarUser = ({ userCurrent }) => {
  return (
    <>
      <Menu isLazy>
        <MenuButton as={Button} size="sm" px={0} py={0} rounded="full">
          <Avatar
            size="sm"
            src={`http://localhost:2000/images/${userCurrent?.avatar}`}
          />
        </MenuButton>
        <MenuList
          zIndex={5}
          border="2px solid"
          borderColor={useColorModeValue("gray.700", "gray.100")}
          boxShadow="4px 4px 0"
        >
          <NavLink _hover={{ textDecoration: "none" }} to={"/profileUser"}>
            <MenuItem>
              <VStack justifyContent="start" alignItems="left">
                <Text fontWeight="500">{userCurrent.username}</Text>
                <Text size="sm" color="gray.500" mt="0 !important">
                  {userCurrent.email}
                </Text>
              </VStack>
            </MenuItem>
          </NavLink>
          <MenuDivider />
          <MenuItem>
            <Text fontWeight="500">Dashboard</Text>
          </MenuItem>
          <MenuItem>
            <Text fontWeight="500">Create Post</Text>
          </MenuItem>
          <MenuItem>
            <Text fontWeight="500">Reading List</Text>
          </MenuItem>
          <MenuItem>
            <Text fontWeight="500">Settings</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem>
            <Text fontWeight="500">Sign Out</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default AvatarUser;
