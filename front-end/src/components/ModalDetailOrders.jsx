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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";

// Cấu hình virtual file system

pdfMake.vfs = vfsFonts.pdfMake.vfs;
const ModalDetailOrders = ({ isOpen, onClose, order }) => {
  if (!order) {
    return;
  }

  const exportPDF = () => {
    if (!order) {
      toast.error("Không có dữ liệu để xuất PDF");
      return;
    }

    const docDefinition = {
      content: [
        {
          text: "Cửa hàng Plant Paradise",
          style: "shopName",
          alignment: "center",
        }, // Tên shop
        {
          text: "HÓA ĐƠN ĐƠN HÀNG",
          style: "name",
          margin: [0, 10, 0, 0],
          alignment: "center",
        },
        {
          text: "Chi tiết đơn hàng",
          style: "header",
          margin: [0, 10, 0, 10],
          alignment: "center",
        },
        {
          text: "Thông tin khách hàng",
          style: "subheader",
          margin: [0, 20, 0, 5],
        },
        {
          table: {
            widths: ["*", "*"], // Chiều rộng của các cột
            body: [
              [{ text: "ID đơn hàng:", bold: true }, order._id],
              [
                { text: "Ngày lập:", bold: true },
                order ? format(new Date(order.createdAt), "dd-MM-yyyy") : "N/A",
              ],
              [
                { text: "Tên khách hàng:", bold: true },
                order?.user?.username || "N/A",
              ],
              [
                { text: "Địa chỉ email:", bold: true },
                order?.user?.email || "N/A",
              ],
              [
                { text: "Số điện thoại:", bold: true },
                order?.user?.numberPhone || "N/A",
              ],
              [
                { text: "Địa chỉ giao hàng:", bold: true },
                {
                  text: `Đường: ${order?.shippingAddress?.street}, Xã: ${order?.shippingAddress?.ward}, Quận/Huyện: ${order?.shippingAddress?.district}, Tỉnh/Thành phố: ${order?.shippingAddress?.province}`,
                },
              ],
              [
                { text: "Phương thức thanh toán:", bold: true },
                order.paymentMethod,
              ],
              [
                { text: "Phương thức vận chuyển:", bold: true },
                order.shippingMethod,
              ],
              [
                { text: "Phí vận chuyển:", bold: true },
                order.paymentMethod === "PayPal"
                  ? "0đ"
                  : `${order.shippingFee.toLocaleString()}đ`,
              ],
              [
                { text: "Khuyến mãi:", bold: true },
                `${order.discount.toLocaleString("vi-VN")} đ`,
              ],
            ],
          },
          layout: "noBorders", // Layout của bảng
        },
        {
          text: "Sản phẩm",
          style: "subheader",
          margin: [0, 20, 0, 10],
        },
        {
          table: {
            widths: ["*", "auto", "auto"], // Chiều rộng của các cột
            body: [
              [
                { text: "Tên sản phẩm", style: "tableHeader" },
                { text: "Số lượng", style: "tableHeader", alignment: "center" },
                { text: "Giá (VND)", style: "tableHeader", alignment: "right" },
              ],
              ...order.items.map((item) => [
                {
                  text: item?.product?.productName,
                },
                {
                  text: item?.quantity?.toString(),
                  alignment: "center",
                },
                {
                  text: `${item.price.toLocaleString("vi-VN")} đ`,
                  alignment: "right",
                },
              ]),
            ],
          },
          layout: "lightHorizontalLines", // Layout của bảng
        },
        {
          text: "Thuế: 20.000 đ",
          margin: [0, 10, 0, 0],
          alignment: "right",
        },
        {
          text: `Tổng tiền: ${order?.finalPrice?.toLocaleString("vi-VN")} đ`,
          margin: [0, 5, 0, 0],
          bold: true,
          alignment: "right",
        },
        {
          text: "Cảm ơn bạn đã mua hàng tại Plant Paradise!",
          margin: [0, 20, 0, 0],
          alignment: "center",
          italics: true,
        },
      ],

      styles: {
        shopName: { fontSize: 16, margin: [0, 10, 0, 0], bold: true },
        name: { fontSize: 24, margin: [0, 10, 0, 0], bold: true },
        subheader: { fontSize: 14, margin: [0, 5, 0, 5], bold: true },
        header: { fontSize: 18, margin: [0, 5, 0, 5], bold: true },
        tableHeader: { fontSize: 12, fillColor: "#eeeeee", bold: true },
      },

      defaultStyle: {},
    };

    pdfMake.createPdf(docDefinition).download("bill.pdf");
    toast.success("Xuất PDF thành công!");
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
                  ? order.finalPrice.toLocaleString("vi-VN") + " đ"
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
          <Button
            onClick={onClose}
            mt="5px"
            px="50px"
            borderRadius="none"
            bg="gray"
            color="black"
            fontWeight="300"
            boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
            mr={2}
          >
            Đóng
          </Button>

          <Button
            onClick={exportPDF}
            mt="5px"
            px="50px"
            borderRadius="none"
            bg="red"
            color="black"
            fontWeight="300"
            boxShadow="sm" // Thêm bóng đổ nhẹ cho nút
            mr={2}
          >
            Xuất PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailOrders;
