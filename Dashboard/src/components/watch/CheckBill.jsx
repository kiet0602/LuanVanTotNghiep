import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";
import { LeafyGreen } from "lucide-react";

// Chỉ cần import vfsFonts mà không cần định nghĩa font
pdfMake.vfs = vfsFonts.pdfMake.vfs;

export default function CheckBill({ isOpenSeeBill, setIsOpenSeeBill, order }) {
  if (!order) return null;

  const {
    user,
    items,
    totalPrice,
    shippingFee,
    finalPrice,
    discount,
    shippingAddress,
    paymentMethod,
    createdAt,
  } = order;

  const exportPDF = async () => {
    const element = document.getElementById("bill-content");
    if (!element) {
      toast.error("Không tìm thấy nội dung để xuất PDF");
      return;
    }

    try {
      // Lấy ảnh từ nội dung hóa đơn

      // Định nghĩa tài liệu PDF
      const docDefinition = {
        content: [
          {
            text: "HÓA ĐƠN",
            style: "header",
            alignment: "center",
            margin: [0, 20],
          },
          {
            text: "Cửa hàng Plant Paradise",
            style: "subheader",
            alignment: "center",
          },
          {
            text: "Địa chỉ: 3/2 quận Xuân Khánh, Ninh Kiều, Cần thơ",
            style: "address",
            alignment: "center",
          },
          {
            text: "Số điện thoại: [0123456789]",
            style: "address",
            alignment: "center",
          },
          {
            text:
              "Ngày đặt hàng: " +
              new Date(createdAt).toLocaleDateString("vi-VN"),
            style: "info",
            margin: [0, 10],
          },
          {
            text: "Thông tin người mua:",
            style: "subheader",
            margin: [0, 10],
          },
          {
            table: {
              body: [
                ["Tên người dùng", user?.username],
                [
                  "Địa chỉ giao hàng",
                  `${shippingAddress?.street}, ${shippingAddress?.ward}, ${shippingAddress?.district}, ${shippingAddress?.province}`,
                ],
                ["Phương thức thanh toán", paymentMethod],
                ["Mã hóa đơn", order?._id],
              ],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 20],
          },
          {
            text: "Chi tiết sản phẩm:",
            style: "subheader",
            margin: [0, 10],
          },
          {
            table: {
              widths: ["*", "auto", "auto"],
              body: [
                ["Tên sản phẩm", "Giá (đ)", "Số lượng"],
                ...items.map((item) => [
                  item.product.productName,
                  item.price,
                  item.quantity,
                ]),
                [
                  { text: "Tổng cộng", bold: true },
                  { text: `${totalPrice} đ`, bold: true },
                  { text: "", bold: true },
                ],
                [
                  { text: "Phí vận chuyển", bold: true },
                  { text: `${shippingFee} đ`, bold: true },
                  { text: "", bold: true },
                ],
                [
                  { text: "Thuế", bold: true },
                  { text: `20000 đ`, bold: true },
                  { text: "", bold: true },
                ],
                [
                  { text: "Giảm giá", bold: true },
                  { text: `${discount} đ`, bold: true },
                  { text: "", bold: true },
                ],
                [
                  { text: "Tổng thanh toán", bold: true },
                  { text: `${finalPrice} đ`, bold: true },
                  { text: "", bold: true },
                ],
              ],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 20],
          },
          {
            text: "Cảm ơn bạn đã mua hàng!",
            style: "footer",
            alignment: "center",
            margin: [0, 20],
          },
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            margin: [0, 20],
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 5],
          },
          address: {
            fontSize: 12,
            margin: [0, 5],
          },
          info: {
            fontSize: 12,
            italics: true,
            margin: [0, 5],
          },
          footer: {
            fontSize: 12,
            italics: true,
            margin: [0, 20],
          },
        },
        defaultStyle: {
          // Không cần chỉ định font chữ, mặc định sẽ là Helvetica
        },
      };

      // Tạo và xuất PDF
      pdfMake.createPdf(docDefinition).download("bill.pdf");
      toast.success("Xuất PDF thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      toast.error("Có lỗi xảy ra khi xuất PDF.");
    }
  };

  return (
    <Dialog
      open={isOpenSeeBill}
      onClose={() => setIsOpenSeeBill(false)}
      className="relative z-50"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white p-6 rounded-lg overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <form>
            {/* Nội dung hóa đơn */}
            <div className="space-y-12" id="bill-content">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="border-b border-gray-900/10 pb-12 text-center">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                    <LeafyGreen className="mr-2" color="#D97706" /> Thông tin
                    đơn hàng
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Thông tin hóa đơn đã được hiển thị đầy đủ bên dưới
                  </p>
                </div>
                {/* Thông tin hóa đơn */}
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tên người dùng
                    </label>
                    <div className="mt-1">{user?.username}</div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Mã hóa đơn
                    </label>
                    <div className="mt-1">{order?._id}</div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ giao hàng
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <span className="font-semibold text-gray-700">
                        Đường:
                      </span>
                      <span>{shippingAddress?.street}</span>
                      <span className="font-semibold text-gray-700">
                        Phường, xã:
                      </span>
                      <span>{shippingAddress?.ward}</span>
                      <span className="font-semibold text-gray-700">
                        Quận, huyện:
                      </span>
                      <span>{shippingAddress?.district}</span>
                      <span className="font-semibold text-gray-700">
                        Tỉnh, thành phố:
                      </span>
                      <span>{shippingAddress?.province}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày đặt hàng
                    </label>
                    <div className="mt-1">
                      {new Date(createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Phương thức thanh toán
                    </label>
                    <div className="mt-1">{paymentMethod}</div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tổng số tiền
                    </label>
                    <div className="mt-1">{totalPrice} VND</div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Phí vận chuyển
                    </label>
                    <div className="mt-1">{shippingFee} VND</div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Giảm giá
                    </label>
                    <div className="mt-1">{discount} VND</div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tổng thanh toán
                    </label>
                    <div className="mt-1 font-semibold">{finalPrice} VND</div>
                  </div>

                  <div className="sm:col-span-6">
                    <h2 className="text-lg font-medium text-gray-700">
                      Sản phẩm trong hóa đơn
                    </h2>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <div
                          key={item._id}
                          className="border p-4 rounded-lg shadow-sm"
                        >
                          <img
                            src={`http://localhost:2000/images/${item?.product.image[0]}`}
                            alt={item?.product?.productName}
                            className="w-full h-48 object-cover rounded-md"
                          />
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.product.productName}
                            </h3>
                            <p className="mt-2 text-gray-700">
                              Giá: {item.price} VND
                            </p>
                            <p className="mt-2 text-gray-700">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => setIsOpenSeeBill(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-green-600"
                onClick={exportPDF}
              >
                Xuất PDF
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
