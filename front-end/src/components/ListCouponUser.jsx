import React, { Fragment, useEffect, useRef, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import {
  Container,
  Box,
  chakra,
  Flex,
  useColorModeValue,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  TableContainer,
  Text,
  Button,
  HStack,
  Stack,
} from "@chakra-ui/react";
import ModalDetailOrders from "./ModalDetailOrders";
import { useRecoilValue } from "recoil";
import userAtom from "../Atom/userAtom";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import userTokenAtom from "../Atom/userAtom.js";

const ListCouponUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [couponsByUserId, setCouponsByUserId] = useState([]); // Sửa từ ordersByUserId thành couponsByUserId
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Sửa từ selectedOrder thành selectedCoupon
  const token = useRecoilValue(userTokenAtom);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [couponsPerPage] = useState(10); // Số coupon trên mỗi trang, sửa từ ordersPerPage thành couponsPerPage

  const fetchCouponsByUser = async () => {
    // Sửa tên hàm từ fetchOrdersByUser thành fetchCouponsByUser
    try {
      const res = await axios.get(
        `http://localhost:2000/api/coupon/getUserCoupons`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      setCouponsByUserId(res.data); // Sửa từ setOrdersByUserId thành setCouponsByUserId
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (coupon) => {
    // Sửa từ order thành coupon
    setSelectedCoupon(coupon); // Sửa từ setSelectedOrder thành setSelectedCoupon
    onOpen();
  };

  const getStatusColor = (isActive) => {
    // Sửa status thành isActive
    return isActive ? "green.500" : "red.500"; // Trả về màu sắc dựa trên isActive
  };

  const removeCoupon = async (couponId) => {
    // Sửa từ removeOrder thành removeCoupon
    const confirmDelete = window.confirm("Bạn có muốn xóa mã khuyến mãi?"); // Sửa từ hủy đơn hàng thành xóa mã khuyến mãi
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:2000/api/coupon/deleteCoupon/${couponId}` // Cập nhật URL để xóa coupon
        );
        fetchCouponsByUser(); // Sửa từ fetchOrdersByUser thành fetchCouponsByUser
        toast.success("Bạn đã xóa mã khuyến mãi thành công"); // Sửa thông báo thành xóa mã khuyến mãi
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    fetchCouponsByUser(); // Sửa từ fetchOrdersByUser thành fetchCouponsByUser
  }, []);

  // Xử lý phân trang
  const indexOfLastCoupon = currentPage * couponsPerPage; // Sửa từ ordersPerPage thành couponsPerPage
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage; // Sửa từ ordersPerPage thành couponsPerPage
  const currentCoupons = couponsByUserId.slice(
    // Sửa từ ordersByUserId thành couponsByUserId
    indexOfFirstCoupon,
    indexOfLastCoupon
  );
  const totalPages = Math.ceil(couponsByUserId.length / couponsPerPage); // Sửa từ ordersByUserId.length thành couponsByUserId.length

  return (
    <>
      <Box bg={useColorModeValue("white", "black")}>
        <Container maxW="7xl" p={{ base: 5, md: 10 }}>
          <Flex justifyContent="center" mb={3}>
            <chakra.h3 fontSize="2xl" fontWeight="bold" textAlign="center">
              Danh sách mã khuyến mãi
            </chakra.h3>
          </Flex>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>mã khuyến mãi</Th> {/* Sửa tiêu đề cột */}
                  <Th>Ngày bắt đầu</Th> {/* Sửa tiêu đề cột */}
                  <Th>Ngày hết hạn</Th> {/* Sửa tiêu đề cột */}
                  <Th>Giảm giá (%)</Th> {/* Sửa tiêu đề cột */}
                  <Th>Tình trạng</Th> {/* Sửa tiêu đề cột */}
                  <Th>Số lần sử dụng</Th> {/* Sửa tiêu đề cột */}
                  <Th>Số tiền đơn hàng trên</Th> {/* Sửa tiêu đề cột */}
                  <Th textAlign={"end"}>Hành động</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentCoupons.map(
                  (
                    coupon,
                    index // Sửa từ orders thành coupons
                  ) => (
                    <Tr key={index}>
                      <Td>{coupon.code}</Td>{" "}
                      {/* Sửa từ order._id thành coupon.code */}
                      <Td>
                        <Box
                          as="span"
                          bg={"gray.800"}
                          color="white"
                          borderRadius="40px"
                          px={2}
                        >
                          {coupon.startDate}{" "}
                          {/* Sửa từ order.createdAt thành coupon.startDate */}
                        </Box>
                      </Td>
                      <Td>
                        <Box
                          as="span"
                          bg={"gray.800"}
                          color="white"
                          borderRadius="40px"
                          px={2}
                        >
                          {coupon.expirationDate}{" "}
                          {/* Sửa từ order.discount thành coupon.expirationDate */}
                        </Box>
                      </Td>
                      <Td>{coupon.discountPercentage}%</Td>{" "}
                      {/* Sửa từ order.discount thành coupon.discountPercentage */}
                      <Td>
                        <Box
                          as="span"
                          bg={getStatusColor(coupon.isActive)} // Sửa từ order.status thành coupon.isActive
                          color="white"
                          borderRadius="40px"
                          px={2}
                        >
                          {coupon.isActive
                            ? "Đang hoạt động"
                            : "Không hoạt động"}{" "}
                          {/* Sửa từ order.status thành coupon.isActive */}
                        </Box>
                      </Td>
                      <Td>{coupon.maxUsage}</Td>{" "}
                      <Td>{coupon.minimumPurchaseAmount}</Td>{" "}
                      <Td textAlign={"end"}>
                        {(coupon.isActive === false || // Kiểm tra trạng thái là boolean
                          coupon.usageCount < coupon.maxUsage || // Thay đổi từ <= thành < để kiểm tra sử dụng còn lại
                          new Date(coupon.expirationDate) > new Date()) && ( // Kiểm tra hạn sử dụng
                          <IconButton
                            aria-label="Xóa"
                            icon={<FaTrash />}
                            onClick={() => removeCoupon(coupon._id)}
                          />
                        )}
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            as="nav"
            aria-label="Pagination"
            spacing={2}
            w="full"
            py={"4"}
            justifyContent="flex-end"
            alignItems="center"
            mt={{ base: 3, md: 0 }}
          >
            <Box>
              <PaginationButton
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
            </Box>
            <Stack direction="row" spacing={2}>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationButton
                  key={index}
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationButton>
              ))}
            </Stack>
            <Box>
              <PaginationButton
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                isDisabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </Box>
          </Stack>

          <ModalDetailOrders
            isOpen={isOpen}
            onClose={onClose}
            order={selectedCoupon} // Sửa từ order thành selectedCoupon
          />
        </Container>
      </Box>
    </>
  );
};

// PaginationButton component
const PaginationButton = ({ children, isActive, isDisabled, onClick }) => {
  const activeStyle = {
    bg: useColorModeValue("gray.300", "gray.700"),
    fontWeight: "bold",
    color: "white",
  };

  return (
    <Button
      onClick={onClick}
      isDisabled={isDisabled}
      bg={isActive ? activeStyle.bg : "transparent"}
      color={isActive ? activeStyle.color : "inherit"}
      border="1px"
      borderColor={useColorModeValue("gray.300", "gray.700")}
      _hover={
        !isDisabled && {
          bg: !isActive ? useColorModeValue("gray.200", "gray.600") : undefined,
        }
      }
    >
      {children}
    </Button>
  );
};

export default ListCouponUser;
