import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";

const ModalDetailOrders = ({ isOpen, onClose, order }) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
      {/* Thay đổi kích thước thành lớn */}
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết đơn hàng: {order ? order._id : ""}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>ID đơn hàng: {order ? order._id : "N/A"}</Text>
          <Text mt={4}>
            Ngày đặt:{" "}
            {order ? format(new Date(order.createdAt), "dd-MM-yyyy") : "N/A"}
          </Text>
          <Text mt={4}>Trạng thái: {order ? order.status : "N/A"}</Text>
          <Text mt={2}>
            Tổng tiền:{" "}
            {order ? order.finalPrice.toLocaleString("vi-VN") + " đ" : "N/A"}
          </Text>
          <Text mt={2}>
            Khuyến mãi:{" "}
            {order ? order.discount.toLocaleString("vi-VN") + " đ" : "N/A"}
          </Text>
          {/* Thêm các thông tin khác nếu cần */}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailOrders;
