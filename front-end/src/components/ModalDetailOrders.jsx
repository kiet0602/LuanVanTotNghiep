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
import pdfFonts from "pdfmake/build/vfs_fonts";
import { text } from "@fortawesome/fontawesome-svg-core";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ModalDetailOrders = ({ isOpen, onClose, order }) => {
  if (!order) {
    return;
  }
  console.log(order);
  const exportPDF = () => {
    if (!order) {
      toast.error("Không có dữ liệu để xuất PDF");
      return;
    }

    const docDefinition = {
      content: [
        { text: "Cửa hàng Plant Paradise", style: "shopName" }, // Tên shop
        {
          text: "ĐƠN HÀNG",
          style: "name",
          margin: [0, 10, 0, 0],
          alignment: "center",
        },
        {
          text: "Chi tiết đơn hàng",
          style: "header",
          margin: [0, 0, 0, 0],
          alignment: "center",
        },
        {
          text: "Thông tin",
          fontSize: 20,
          margin: [0, 0, 0, 0],
        },

        {
          table: {
            widths: ["*", "*"], // Chiều rộng của các cột
            body: [
              [
                {
                  text: "ID đơn hàng:",
                  bold: true,
                  alignment: "justify",
                  margin: [0, 0, 0, 0],
                },
                {
                  text: order._id,
                  alignment: "justify",
                  margin: [0, 0, 0, 0],
                },
              ],
              [
                {
                  text: "Ngày lập:",
                  bold: true,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: order
                    ? format(new Date(order.createdAt), "dd-MM-yyyy")
                    : "N/A",
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
              ],
              [
                {
                  text: "Tên khách hàng:",
                  bold: true,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: order?.user?.username,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
              ],
              [
                {
                  text: "Địa chỉ email:",
                  bold: true,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: order?.user?.email,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
              ],
              [
                {
                  text: "Số điện thoại:",
                  bold: true,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: order?.user?.numberPhone,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
              ],
              [
                {
                  text: "Địa chỉ giao hàng:",
                  bold: true,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: `Đường: ${order?.shippingAddress?.street}, Xã ${order?.shippingAddress?.ward}, Quận/Huyện ${order?.shippingAddress?.district}, Tỉnh/Thành phố ${order?.shippingAddress?.province}`,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
              ],
              [
                {
                  text: "Phương thức thanh toán:",
                  bold: true,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: order.paymentMethod,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
              ],
              [
                {
                  text: "Khuyến mãi:",
                  bold: true,
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
                {
                  text: order.discount.toLocaleString("vi-VN") + " đ",
                  alignment: "justify",
                  margin: [0, 5, 0, 0],
                },
              ],
            ],
          },
          layout: "noBorders", // Layout của bảng
        },
        {
          text: "Sản phẩm",
          fontSize: 20,
          margin: [0, 20, 0, 0],
        },

        // Thêm bảng sản phẩm
        {
          table: {
            widths: ["*", "auto", "auto"], // Chiều rộng của các cột
            body: [
              // Header của bảng sản phẩm
              [
                { text: "Tên sản phẩm", style: "tableHeader" },
                { text: "Số lượng", style: "tableHeader" },
                { text: "Giá", style: "tableHeader" },
              ],
              // Duyệt qua các sản phẩm trong items
              ...order.items.map((item) => [
                {
                  text: item.product.productName,
                },
                {
                  text: item.quantity.toString(),
                  alignment: "center",
                },
                {
                  text: `${item.price.toLocaleString("vi-VN")} đ`, // Giá sau khuyến mãi
                  alignment: "right",
                },
              ]),
            ],
          },
          layout: "lightHorizontalLines", // Layout của bảng
        },
        //  {
        //   table: {
        //     widths: ["*", "*"], // Chiều rộng của các cột
        //         body: [
        //           [

        //             {

        //             }
        //           ]
        //         ]
        //   }
        //  }
        {
          text: "Thuế: 20.000đ",
          margin: [400, 20, 0, 0],
        },
        {
          text: `Tổng tiền: ${order.finalPrice.toLocaleString("vi-VN")}đ`,
          margin: [400, 0, 0, 0],
        },
      ],

      styles: {
        shopName: { fontSize: 10, bold: false },
        name: { fontSize: 30, bold: true },
        subheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 5] },
        sectionHeader: { fontSize: 14, bold: true, color: "green" },
        normalText: { fontSize: 12, margin: [0, 2, 0, 2] },
        tableHeader: { fontSize: 12, bold: true, fillColor: "#eeeeee" },
      },

      defaultStyle: {
        font: "Roboto",
      },
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
