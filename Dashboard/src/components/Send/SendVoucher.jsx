import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { CheckCircle } from "lucide-react"; // Thay đổi biểu tượng nếu cần
import { toast } from "react-toastify";
import { getAllCoupons, sendVoucherEmail } from "../../service/couponSevice"; // Đảm bảo đường dẫn chính xác
// Đường dẫn đến file service gửi voucher

export default function SendVoucher({
  isOpenSendVoucher,
  setIsOpenSendVoucher,
  user,
}) {
  if (!user) {
    return;
  }
  const [coupons, setCoupons] = useState([]); // State để lưu danh sách coupon
  const [loading, setLoading] = useState(true); // State để kiểm soát trạng thái tải
  const [selectedCouponId, setSelectedCouponId] = useState(""); // State để lưu coupon đã chọn
  const [isLoading, setIsLoading] = useState(false); // State để kiểm soát trạng thái loading

  const fetchCoupons = async () => {
    try {
      const data = await getAllCoupons(); // Gọi hàm để lấy coupon
      setCoupons(data); // Cập nhật state với danh sách coupon
    } catch (error) {
      toast.error("Không thể lấy danh sách voucher."); // Hiển thị thông báo lỗi nếu có
    } finally {
      setLoading(false); // Đặt loading thành false sau khi tải xong
    }
  };

  useEffect(() => {
    fetchCoupons(); // Gọi hàm lấy coupon khi component mount
  }, []);

  const handleSendVoucher = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    if (!selectedCouponId) {
      toast.error("Vui lòng chọn voucher."); // Thông báo lỗi nếu chưa chọn voucher
      return;
    }
    setIsLoading(true); // Đặt trạng thái loading thành true khi bắt đầu gửi
    try {
      const response = await sendVoucherEmail(user._id, selectedCouponId); // Gọi hàm gửi voucher
      toast.success("Mã khuyến mãi đã gửi đến Email của người dùng"); // Hiển thị thông báo thành công
      setIsOpenSendVoucher(false); // Đóng modal sau khi gửi thành công
    } catch (error) {
      toast.error(response.msg); // Hiển thị thông báo lỗi
    } finally {
      setIsLoading(false); // Đặt trạng thái loading thành false sau khi hoàn tất
    }
  };

  return (
    <Dialog
      open={isOpenSendVoucher}
      onClose={() => setIsOpenSendVoucher(false)}
      className="relative z-50"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />

      {/* Nội dung modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white p-6 rounded-lg overflow-y-auto max-h-[80vh]">
          {/* Form */}
          <form onSubmit={handleSendVoucher}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12 text-center">
                <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                  <CheckCircle className="mr-2" color="#4CAF50" /> Chọn voucher
                  để gửi
                </h2>
              </div>
              <div className="mt-10">
                <label
                  htmlFor="coupons"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Chọn voucher
                </label>
                {loading ? (
                  <p>Đang tải danh sách voucher...</p>
                ) : (
                  <select
                    name="coupons"
                    className="mt-2 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setSelectedCouponId(e.target.value)} // Cập nhật coupon đã chọn
                  >
                    <option value="">-- Chọn voucher --</option>
                    {coupons.map((coupon) => (
                      <option key={coupon._id} value={coupon._id}>
                        {coupon.code} - Giảm giá {coupon.discountPercentage}% -
                        Trên giá{" "}
                        {coupon?.minimumPurchaseAmount.toLocaleString("vi-VN")}đ
                        - ngày bắt đầu {coupon.startDate} - ngày kết thúc{" "}
                        {coupon.expirationDate} - Lần sử dụng {coupon.maxUsage}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => setIsOpenSendVoucher(false)} // Đóng modal khi nhấn Cancel
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
                disabled={isLoading} // Vô hiệu hóa nút khi đang loading
              >
                {isLoading ? "Đang gửi..." : "Gửi"}{" "}
                {/* Hiển thị nội dung khác nhau */}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
