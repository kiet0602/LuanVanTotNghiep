import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Edit, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { updateCoupon } from "../../service/couponSevice";
import { format, parseISO } from "date-fns";

export default function UpdateCoupon({
  isUpdateCouponOpen,
  setUpdateCouponIsOpen,
  coupon,
  onUpdateCoupon,
}) {
  if (!coupon) {
    return;
  }
  useEffect(() => {
    if (coupon) {
      setCode(coupon.code);
      setDiscountPercentage(coupon.discountPercentage);

      // Kiểm tra xem startDate và expirationDate có hợp lệ không
      if (coupon.startDate) {
        setStartDate(coupon.startDate);
      } else {
        setStartDate(""); // Hoặc một giá trị mặc định nào đó
      }

      if (coupon.expirationDate) {
        setExpirationDate(coupon.expirationDate);
      } else {
        setExpirationDate(""); // Hoặc một giá trị mặc định nào đó
      }

      setMinimumPurchaseAmount(coupon.minimumPurchaseAmount);
      setIsActive(coupon.isActive);
      setMaxUsage(coupon.maxUsage);
    }
  }, [coupon]);

  // Khởi tạo các state từ coupon
  const [code, setCode] = useState(coupon.code || "");
  const [discountPercentage, setDiscountPercentage] = useState(
    coupon.discountPercentage || 0
  );
  const [startDate, setStartDate] = useState(coupon.startDate || "");
  const [expirationDate, setExpirationDate] = useState(
    coupon.expirationDate || ""
  );
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState(
    coupon.minimumPurchaseAmount || 0
  );
  const [maxUsage, setMaxUsage] = useState(coupon.maxUsage || 0);
  const [isActive, setIsActive] = useState(coupon.isActive || false);

  const [isOpenHide, setIsOpenHide] = useState(false);
  const [isOpenHideExpiration, setIsOpenHideExpiration] = useState(false);

  // Xử lý cập nhật discountPercentage
  const handleInputChangeCheckDiscount = (e) => {
    const value = e.target.value;
    if (value > 100) {
      setDiscountPercentage(100);
    } else {
      setDiscountPercentage(value);
    }
  };

  // Hàm xử lý cập nhật mã khuyến mãi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuyển đổi định dạng ngày
    const formattedStartDate = startDate.split("-").reverse().join("-");
    const formattedExpirationDate = expirationDate
      .split("-")
      .reverse()
      .join("-");

    const updatedCouponData = {
      code,
      discountPercentage,
      startDate: formattedStartDate,
      expirationDate: formattedExpirationDate,
      minimumPurchaseAmount,
      isActive,
      maxUsage,
    };

    try {
      // Gọi hàm updateCoupon từ service
      const response = await updateCoupon(coupon._id, updatedCouponData);
      onUpdateCoupon(response);
      toast.success("Cập nhật mã khuyến mãi thành công!");
      setUpdateCouponIsOpen(false); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Cập nhật mã khuyến mãi thất bại!";
      toast.error(errorMessage); // Hiển thị thông báo lỗi từ API
      setStartDate(coupon.startDate || "");
      setExpirationDate(coupon.expirationDate || "");
    }
  };

  return (
    <Dialog
      open={isUpdateCouponOpen}
      onClose={() => setUpdateCouponIsOpen(false)}
      className="relative z-50"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />

      {/* Nội dung modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-5xl bg-white p-6 rounded-lg overflow-y-auto max-h-screen">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12 text-center">
                <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                  <ShoppingBag className="mr-2" color="#8B5CF6" /> Cập nhật
                  khuyến mãi
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Thông tin này sẽ được hiển thị công khai, hãy cẩn thận.
                </p>
              </div>

              {/* Mã khuyến mãi */}
              <div className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2 gap-x-6">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Mã khuyến mãi
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Nhập mã khuyến mãi"
                    className="w-2/3 mx-auto rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Phần trăm giảm giá */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Phần trăm giảm giá
                  </label>
                  <input
                    type="number"
                    value={discountPercentage}
                    onChange={handleInputChangeCheckDiscount}
                    placeholder="Phần trăm giảm giá"
                    className="w-2/3 mx-auto rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Ngày bắt đầu */}
                <div className="sm:col-span-1">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium leading-6 text-gray-900 mr-2">
                      Ngày bắt đầu cũ:
                      <span className="text-red-500"> {coupon.startDate}</span>
                    </label>
                    <button
                      type="button" // Đảm bảo là button để không kích hoạt submit
                      onClick={() => setIsOpenHide((prev) => !prev)} // Đảo ngược trạng thái
                      className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    >
                      <Edit />
                    </button>
                  </div>
                  {isOpenHide && ( // Sử dụng && để kiểm tra trạng thái
                    <>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Chọn ngày bắt đầu
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-2/3 mx-auto rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </>
                  )}
                </div>

                {/* Ngày hết hạn */}
                <div className="sm:col-span-1">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium leading-6 text-gray-900 mr-2">
                      Ngày hết hạn cũ:
                      <span className="text-red-500">
                        {" "}
                        {coupon.expirationDate}
                      </span>
                    </label>
                    <button
                      type="button" // Thay đổi loại nút thành button để không kích hoạt form submit
                      onClick={() => setIsOpenHideExpiration((prev) => !prev)} // Đảo ngược trạng thái
                      className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    >
                      <Edit />
                    </button>
                  </div>
                  {isOpenHideExpiration && (
                    <>
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Chọn ngày hết hạn
                      </label>
                      <input
                        value={expirationDate}
                        type="date"
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="w-2/3 mx-auto rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </>
                  )}
                </div>

                {/* Số tiền tối thiểu */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Số tiền tối thiểu
                  </label>
                  <input
                    type="number"
                    value={minimumPurchaseAmount}
                    onChange={(e) => setMinimumPurchaseAmount(e.target.value)}
                    placeholder="Số tiền tối thiểu"
                    className="w-2/3 mx-auto rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Số lần sử dụng tối đa */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Số lần sử dụng tối đa
                  </label>
                  <input
                    type="number"
                    value={maxUsage}
                    onChange={(e) => setMaxUsage(e.target.value)}
                    placeholder="Số lần sử dụng tối đa"
                    className="w-2/3 mx-auto rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="sm:col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    className="mr-2"
                  />
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Kích hoạt hoạt động
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => setUpdateCouponIsOpen(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
