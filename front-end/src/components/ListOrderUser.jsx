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
} from "@chakra-ui/react"; // Import Stack từ Chakra UI
import ModalDetailOrders from "./ModalDetailOrders";
import { useRecoilValue } from "recoil";
import userAtom from "../Atom/userAtom";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";

const ListOrderUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ordersByUserId, setOrdersByUserId] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const user = useRecoilValue(userAtom);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Số đơn hàng trên mỗi trang

  const fetchOrdersByUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2000/api/checkout/getAllcheckOutbyIdUser/${user._id}`
      );
      setOrdersByUserId(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "yellow.500";
      case "Đang xử lý":
        return "green.500";
      case "Đã hủy":
        return "red.500";
      case "Đang giao hàng":
        return "orange.500";
      case "Đã nhận hàng":
        return "blue.500";
      default:
        return "gray.500";
    }
  };

  const removeOrder = async (orderId) => {
    const confirmDelete = window.confirm("Bạn có muốn hủy đơn hàng?");
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:2000/api/checkout/deleteCheckOut/${orderId}`
        );
        fetchOrdersByUser();
        toast.success("Bạn đã hủy đơn hàng thành công");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    fetchOrdersByUser();
  }, [user]);

  // Xử lý phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = ordersByUserId.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(ordersByUserId.length / ordersPerPage);

  return (
    <>
      <Box bg={useColorModeValue("white", "black")}>
        <Container maxW="10xl" p={{ base: 5, md: 10 }}>
          <Flex justifyContent="left" mb={3}>
            <chakra.h3 fontSize="2xl" fontWeight="bold" textAlign="center">
              Danh sách đơn hàng
            </chakra.h3>
          </Flex>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Id đơn hàng</Th>
                  <Th>Ngày đặt hàng</Th>
                  <Th>Khuyến mãi</Th>
                  <Th>Trạng thái</Th>
                  <Th>Tổng tiền</Th>
                  <Th textAlign={"end"}>Hành động</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentOrders.map((order, index) => (
                  <Tr key={index}>
                    <Td>{order._id}</Td>
                    <Td>
                      <Box
                        as="span"
                        bg={"gray.800"}
                        color="white"
                        borderRadius="40px"
                        px={2}
                      >
                        {format(new Date(order.createdAt), "dd-MM-yyyy")}
                      </Box>
                    </Td>
                    <Td>
                      {order.discount.toLocaleString("vi-VN") === "0"
                        ? "Không có"
                        : `${order.discount.toLocaleString("vi-VN")} đ`}
                    </Td>
                    <Td>
                      <Box
                        as="span"
                        bg={getStatusColor(order.status)}
                        color="white"
                        borderRadius="40px"
                        px={2}
                      >
                        {order.status}
                      </Box>
                    </Td>
                    <Td>{order.finalPrice.toLocaleString("vi-VN")} đ</Td>
                    <Td textAlign={"end"}>
                      <IconButton
                        aria-label="Xem chi tiết"
                        icon={<FaEye />}
                        onClick={() => openModal(order)}
                        mr={2}
                      />
                      {order.status === "Chờ xử lý" && (
                        <IconButton
                          aria-label="Xóa"
                          icon={<FaTrash />}
                          onClick={() => removeOrder(order._id)}
                        />
                      )}
                      {order.status === "Đang giao hàng" && (
                        <IconButton
                          aria-label="Cập nhật"
                          icon={<FaEdit />} // Thay đổi biểu tượng để đại diện cho việc cập nhật (ví dụ, biểu tượng bút)
                          onClick={() => updateOrder(order._id)} // Thêm hàm xử lý cập nhật đơn hàng
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
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
            justifyContent="flex-end" // Thay đổi từ center thành flex-end để căn phải
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
            order={selectedOrder}
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

export default ListOrderUser;
