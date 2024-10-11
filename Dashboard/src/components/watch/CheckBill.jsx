import { Dialog } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { LeafyGreen } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

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

  return (
    <Dialog
      id="bill-content" // Thêm id vào đây
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
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="border-b border-gray-900/10 pb-12 text-center">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                    <LeafyGreen className="mr-2" color="#D97706" /> Hóa đơn của
                    bạn
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Thông tin hóa đơn đã được hiển thị đầy đủ bên dưới
                  </p>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Tên người dùng */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tên người dùng
                    </label>
                    <div className="mt-1">{user?.username}</div>
                  </div>

                  {/* Mã hóa đơn */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Mã hóa đơn
                    </label>
                    <div className="mt-1">{order?._id}</div>
                  </div>

                  {/* Địa chỉ giao hàng */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ giao hàng
                    </label>
                    <div className="mt-1">{shippingAddress}</div>
                  </div>

                  {/* Ngày đặt hàng */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày đặt hàng
                    </label>
                    <div className="mt-1">
                      {new Date(createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  {/* Phương thức thanh toán */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Phương thức thanh toán
                    </label>
                    <div className="mt-1">{paymentMethod}</div>
                  </div>

                  {/* Tổng số tiền */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tổng số tiền
                    </label>
                    <div className="mt-1">{totalPrice} VND</div>
                  </div>

                  {/* Phí vận chuyển */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Phí vận chuyển
                    </label>
                    <div className="mt-1">{shippingFee} VND</div>
                  </div>

                  {/* Giảm giá */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Giảm giá
                    </label>
                    <div className="mt-1">{discount} VND</div>
                  </div>

                  {/* Tổng thanh toán */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tổng thanh toán
                    </label>
                    <div className="mt-1 font-semibold">{finalPrice} VND</div>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div className="sm:col-span-6">
                    <h2 className="text-lg font-medium text-gray-700">
                      Sản phẩm trong hóa đơn
                    </h2>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Lặp qua từng sản phẩm */}
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
