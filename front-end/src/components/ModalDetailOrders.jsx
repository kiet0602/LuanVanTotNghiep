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
  Divider,
  Table,
  Tbody,
  Tr,
  Td,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { format } from "date-fns";

import { toast } from "react-toastify"; // Đảm bảo bạn đã import toast
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ModalDetailOrders = ({ isOpen, onClose, order }) => {
  if (!order) {
    return;
  }

  const exportPDF = async () => {
    const element = document.getElementById("bill-content");
    if (!element) {
      toast.error("Không tìm thấy nội dung để xuất PDF");
      return;
    }

    // Ẩn tất cả hình ảnh trước khi tạo canvas
    const images = element.querySelectorAll("img");
    images.forEach((img) => {
      img.style.display = "none";
    });

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const margin = 10; // Thêm lề
      const imgWidth = 210 - 2 * margin; // Chiều rộng A4 trừ lề (mm)
      const pageHeight = 297 - 2 * margin; // Chiều cao A4 trừ lề (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Nếu hình ảnh cao hơn chiều dài trang, cần chia nhỏ
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("bill.pdf");
      toast.success("Xuất PDF thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      toast.error("Có lỗi xảy ra khi xuất PDF.");
    } finally {
      // Hiển thị lại hình ảnh sau khi đã xuất PDF
      images.forEach((img) => {
        img.style.display = "block";
      });
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
        <ModalHeader className="text-lg font-bold">
          Đơn hàng của bạn
        </ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody id="bill-content">
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                ID đơn hàng:
              </Text>
              <Text color="gray.800">{order ? order._id : "N/A"}</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Ngày đặt:
              </Text>
              <Text color="gray.800">
                {order
                  ? format(new Date(order.createdAt), "dd-MM-yyyy")
                  : "N/A"}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Trạng thái:
              </Text>
              <Text color="gray.800">{order ? order.status : "N/A"}</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Phương thức thanh toán:
              </Text>
              <Text color="gray.800">
                {order ? order.paymentMethod : "N/A"}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Địa chỉ giao hàng:
              </Text>
              <Text color="gray.800">
                {order ? order.shippingAddress : "N/A"}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Phí vận chuyển:
              </Text>
              <Text color="gray.800">
                {order
                  ? order.shippingFee.toLocaleString("vi-VN") + " đ"
                  : "N/A"}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Phương thức giao hàng:
              </Text>
              <Text color="gray.800">
                {order ? order.shippingMethod : "N/A"}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Tổng tiền:
              </Text>
              <Text color="gray.800">
                {order
                  ? order.totalPrice.toLocaleString("vi-VN") + " đ"
                  : "N/A"}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Khuyến mãi:
              </Text>
              <Text color="gray.800">
                {order ? order.discount.toLocaleString("vi-VN") + " đ" : "N/A"}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Người đặt hàng:
              </Text>
              <Text color="gray.800">
                {order && order.user ? order.user.username : "N/A"}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold" color="gray.700">
                Email người dùng:
              </Text>
              <Text color="gray.800">
                {order && order.user ? order.user.email : "N/A"}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="teal" mr={2}>
            Đóng
          </Button>
          <Button onClick={exportPDF} colorScheme="red">
            Xuất PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailOrders;
