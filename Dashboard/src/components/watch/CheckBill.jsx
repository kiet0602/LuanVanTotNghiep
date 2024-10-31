import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";
import { LeafyGreen } from "lucide-react";

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
                      </span>{" "}
                      {/* Màu đậm cho tên trường */}
                      <span className="">{shippingAddress?.street}</span>{" "}
                      {/* Dữ liệu với màu mờ */}
                      <span className="font-semibold text-gray-700">
                        Phường, xã:
                      </span>
                      <span className="">{shippingAddress?.ward}</span>
                      <span className="font-semibold text-gray-700">
                        Quận, huyện:
                      </span>
                      <span className="">{shippingAddress?.district}</span>
                      <span className="font-semibold text-gray-700">
                        Tỉnh, thành phố:
                      </span>
                      <span className="">{shippingAddress?.province}</span>
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
