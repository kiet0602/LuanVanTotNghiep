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
import { NavLink, useNavigate } from "react-router-dom";
import userAtom from "../Atom/userAtom";
import { useResetRecoilState } from "recoil";

//hooks Custom
const AvatarUser = ({ userCurrent }) => {
  const navigate = useNavigate();
  const resetUser = useResetRecoilState(userAtom);

  const handleLogout = () => {
    // Xóa token và thông tin người dùng từ localStorage
    localStorage.removeItem("favoritesCount"); // Xóa favorites count
    localStorage.removeItem("token"); // Xóa token
    localStorage.removeItem("userCurrent"); // Xóa thông tin người dùng

    resetUser(null); // Reset state người dùng
    navigate("/signIn"); // Chuyển hướng đến trang đăng nhập
    window.location.reload(); // Reload lại trang
  };

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
          border="1px "
          borderColor={useColorModeValue("gray.700", "gray.100")}
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
          <NavLink to="/favirotesProduct">
            <MenuItem>
              <Text fontWeight="500">Sản phẩm yêu thích</Text>
            </MenuItem>
          </NavLink>

          <MenuItem>
            <Text fontWeight="500">Cài đặt</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem>
            <Text fontWeight="500" onClick={handleLogout}>
              Đăng xuất
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default AvatarUser;
