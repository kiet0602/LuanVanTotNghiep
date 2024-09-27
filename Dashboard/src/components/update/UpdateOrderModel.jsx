import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { CheckCircle } from "lucide-react"; // Thay đổi biểu tượng nếu cần
import { updateOrder } from "../../service/orderService.js";
import { toast } from "react-toastify";

export default function UpdateOrderModal({
  fetchOrders, // Hàm để làm mới danh sách đơn hàng sau khi cập nhật
  isOpenUpdate,
  setIsOpenUpdate,
  order,
}) {
  const [status, setStatus] = useState(order?.status || ""); // Lưu trạng thái đơn hàng
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status); // Cập nhật trạng thái vào input khi có order mới
    }
  }, [order]);

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const updates = { status }; // Tạo đối tượng cập nhật chỉ chứa trạng thái
      await updateOrder(order._id, updates); // Gọi API để cập nhật đơn hàng
      setIsOpenUpdate(false); // Đóng modal
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      fetchOrders(); // Làm mới danh sách đơn hàng
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Cập nhật trạng thái thất bại");
      setError(error.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Dialog
      open={isOpenUpdate}
      onClose={() => setIsOpenUpdate(false)}
      className="relative z-50"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />

      {/* Nội dung modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-lg overflow-y-auto max-h-screen">
          {/* Form */}
          <form onSubmit={handleUpdateOrder}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12 text-center">
                <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                  <CheckCircle className="mr-2" color="#4CAF50" /> Cập nhật
                  trạng thái đơn hàng
                </h2>
              </div>
              <div className="mt-10">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Trạng thái đơn hàng
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giao hàng">Đã giao hàng</option>
                  <option value="Đã nhận hàng">Đã nhận hàng</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => setIsOpenUpdate(false)} // Đóng modal khi nhấn Cancel
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
              >
                Lưu
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
