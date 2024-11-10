import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Button,
} from "@chakra-ui/react"; // Import Chakra UI components
import ModalDetailOrders from "./ModalDetailOrders";
import { useRecoilValue } from "recoil";
import userAtom from "../Atom/userAtom";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { FaEye, FaTimes } from "react-icons/fa";

const ListOrderUserUpdate = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ordersByUserId, setOrdersByUserId] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const user = useRecoilValue(userAtom);

  const fetchOrdersByUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2000/api/checkout/getAllcheckOutbyIdUser/${user?._id}`
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

  const receiveOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:2000/api/checkout/${orderId}/receive`);
      fetchOrdersByUser();
    } catch (error) {
      console.log(error.message);
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmDelete = window.confirm("Bạn có muốn hủy đơn hàng?");
    if (confirmDelete) {
      try {
        await axios.put(`http://localhost:2000/api/checkout/${orderId}/cancel`);
        fetchOrdersByUser();
        toast.success("Bạn đã hủy đơn hàng thành công");
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  const resetOrder = async (orderId) => {
    const confirmDelete = window.confirm("Bạn có muốn đặt lại đơn hàng?");
    if (!confirmDelete) {
      return;
    } else {
      try {
        await axios.put(`http://localhost:2000/api/checkout/${orderId}/reset`);
        fetchOrdersByUser();
        toast.success("Bạn đã đặt lại đơn hàng thành công");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const removeOrder = async (orderId) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa đơn hàng?");
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:2000/api/checkout/deleteCheckOut/${orderId}`
        );
        fetchOrdersByUser();
        toast.success("Bạn đã xóa đơn hàng thành công");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    fetchOrdersByUser();
  }, [user]);

  // Function to filter orders by status
  const filterOrdersByStatus = (status) => {
    return ordersByUserId.filter((order) => order.status === status);
  };

  return (
    <Container maxW="7xl" p={{ base: 5, md: 10 }}>
      <Flex justifyContent="center" mb={10}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Danh sách đơn hàng của bạn
        </Text>
      </Flex>
      <Tabs isLazy>
        <TabList>
          <Tab>Chờ xử lý</Tab>
          <Tab>Đang xử lý</Tab>
          <Tab>Đang giao hàng</Tab>
          <Tab>Đã nhận hàng</Tab>
          <Tab>Đã hủy</Tab>
        </TabList>

        <TabPanels>
          {/* Chờ xử lý */}
          <TabPanel>
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
                  {filterOrdersByStatus("Chờ xử lý").map((order, index) => (
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
                          bg="yellow.500"
                          color="white"
                          borderRadius="40px"
                          px={2}
                        >
                          {order.status}
                        </Box>
                      </Td>
                      <Td>{order.finalPrice.toLocaleString("vi-VN")} đ</Td>
                      <Td textAlign={"end"}>
                        <Flex
                          alignItems="center"
                          gap={3}
                          justifyContent="flex-end"
                        >
                          {/* View button */}
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => openModal(order)}
                            variant="outline"
                            aria-label="Xem chi tiết"
                          >
                            Xem
                          </Button>

                          {/* Delete button */}
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => cancelOrder(order._id)}
                            variant="outline"
                            aria-label="Hủy đơn"
                          >
                            Hủy đơn
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          {/* Example for "Đang xử lý" */}
          <TabPanel>
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
                  {filterOrdersByStatus("Đang xử lý").map((order, index) => (
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
                          bg="blue.500"
                          color="white"
                          borderRadius="40px"
                          px={2}
                        >
                          {order.status}
                        </Box>
                      </Td>
                      <Td>{order.finalPrice.toLocaleString("vi-VN")} đ</Td>
                      <Td textAlign={"end"}>
                        <Flex
                          alignItems="center"
                          gap={3}
                          justifyContent="flex-end"
                        >
                          {/* View button */}
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => openModal(order)}
                            variant="outline"
                            aria-label="Xem chi tiết"
                          >
                            Xem
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          {/* Đang giao hàng */}
          <TabPanel>
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
                  {filterOrdersByStatus("Đang giao hàng").map(
                    (order, index) => (
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
                            bg="blue.500"
                            color="white"
                            borderRadius="40px"
                            px={2}
                          >
                            {order.status}
                          </Box>
                        </Td>
                        <Td>{order.finalPrice.toLocaleString("vi-VN")} đ</Td>
                        <Td textAlign={"end"}>
                          <Flex
                            alignItems="center"
                            gap={3}
                            justifyContent="flex-end"
                          >
                            {/* View button */}
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => openModal(order)}
                              variant="outline"
                              aria-label="Xem chi tiết"
                            >
                              Xem
                            </Button>

                            {/* Delete button */}
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => receiveOrder(order._id)}
                              variant="outline"
                              aria-label="Hủy đơn"
                            >
                              Đã nhận
                            </Button>
                          </Flex>
                        </Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          {/* Đã nhận hàng */}
          <TabPanel>
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
                  {filterOrdersByStatus("Đã nhận hàng").map((order, index) => (
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
                          bg="blue.500"
                          color="white"
                          borderRadius="40px"
                          px={2}
                        >
                          {order.status}
                        </Box>
                      </Td>
                      <Td>{order.finalPrice.toLocaleString("vi-VN")} đ</Td>
                      <Td textAlign={"end"}>
                        <Flex
                          alignItems="center"
                          gap={3}
                          justifyContent="flex-end"
                        >
                          {/* View button */}
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => openModal(order)}
                            variant="outline"
                            aria-label="Xem chi tiết"
                          >
                            Xem
                          </Button>

                          {/* Delete button */}
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => removeOrder(order._id)}
                            variant="outline"
                            aria-label="Hủy đơn"
                          >
                            Xóa
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          {/* Đã hủy */}
          <TabPanel>
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
                  {filterOrdersByStatus("Đã hủy").map((order, index) => (
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
                          bg="blue.500"
                          color="white"
                          borderRadius="40px"
                          px={2}
                        >
                          {order.status}
                        </Box>
                      </Td>
                      <Td>{order.finalPrice.toLocaleString("vi-VN")} đ</Td>
                      <Td textAlign={"end"}>
                        <Flex
                          alignItems="center"
                          gap={3}
                          justifyContent="flex-end"
                        >
                          {/* View button */}
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => openModal(order)}
                            variant="outline"
                            aria-label="Xem chi tiết"
                          >
                            Xóa
                          </Button>

                          {/* Delete button */}
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => resetOrder(order._id)}
                            variant="outline"
                            aria-label="Hủy đơn"
                          >
                            Đặt lại
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => openModal(order)}
                            variant="outline"
                            aria-label="Hủy đơn"
                          >
                            Xem
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Repeat for other statuses like "Đang giao hàng", "Đã nhận hàng", "Đã hủy" */}
        </TabPanels>
      </Tabs>

      <ModalDetailOrders
        isOpen={isOpen}
        onClose={onClose}
        order={selectedOrder}
      />
    </Container>
  );
};

export default ListOrderUserUpdate;
