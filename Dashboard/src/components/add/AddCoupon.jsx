import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ShoppingBag } from "lucide-react";
import { parseISO } from "date-fns"; // Đảm bảo import parseISO từ date-fns

import { format } from "date-fns";
import { toast } from "react-toastify";
import { createCoupon } from "../../service/couponSevice";

export default function AddCoupon({
  isCouponOpen,
  setCouponIsOpen,
  onAddCoupon,
}) {
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState("");
  const [isActive, setIsActive] = useState(true); // Mặc định là active
  const [maxUsage, setMaxUsage] = useState("");

  const handleInputChangeCheckDiscount = (e) => {
    const value = e.target.value;
    if (value > 100) {
      setDiscountPercentage(100); // Cập nhật trường discountPercentage
    } else {
      setDiscountPercentage(value); // Cập nhật trường discountPercentage
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!code) {
      toast.error("Vui lòng nhập mã khuyến mãi.");
      return;
    }

    if (!discountPercentage) {
      toast.error("Vui lòng nhập tỷ lệ giảm giá.");
      return;
    }

    // Kiểm tra ngày
    if (!startDate || !expirationDate) {
      toast.error("Vui lòng nhập ngày bắt đầu và ngày hết hạn.");
      return;
    }

    if (!minimumPurchaseAmount) {
      toast.error("Vui lòng nhập số tiền mua tối thiểu.");
      return;
    }

    if (!maxUsage) {
      toast.error("Vui lòng nhập số lượt sử dụng tối đa.");
      return;
    }

    const couponData = {
      code,
      discountPercentage: parseInt(discountPercentage),
      startDate: format(new Date(startDate), "dd-MM-yyyy"), // Chuyển đổi ngày
      expirationDate: format(new Date(expirationDate), "dd-MM-yyyy"), // Chuyển đổi ngày
      minimumPurchaseAmount: parseFloat(minimumPurchaseAmount),
      isActive,
      maxUsage: parseInt(maxUsage),
    };

    try {
      const newCoupon = await createCoupon(couponData); // Sử dụng API thêm coupon
      toast.success("Mã khuyến mãi đã được thêm thành công!");
      onAddCoupon(newCoupon); // Reset các trường sau khi thêm coupon
      setCode("");
      setDiscountPercentage("");
      setStartDate("");
      setExpirationDate("");
      setMinimumPurchaseAmount("");
      setMaxUsage("");
      // Đóng modal nếu cần
      setCouponIsOpen(false);
    } catch (error) {
      console.error("Failed to add coupon:", error);
      toast.error("Đã có lỗi xảy ra khi thêm mã khuyến mãi. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog
      open={isCouponOpen}
      onClose={() => setCouponIsOpen(false)}
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
                  <ShoppingBag className="mr-2" color="#8B5CF6" /> Tạo khuyến
                  mãi
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
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Nhập mã khuyến mãi"
                    className=" w-2/3 mx-auto rounded-md border-0 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Phần trăm giảm giá */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Phần trăm giảm giá
                  </label>
                  <input
                    type="number"
                    onChange={handleInputChangeCheckDiscount}
                    placeholder="Phần trăm giảm giá"
                    className=" w-2/3 mx-auto rounded-md border-0 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Ngày bắt đầu */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    className=" w-2/3 mx-auto rounded-md border-0 py-1.5 px-2 text-gray-900 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Ngày hết hạn */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className=" w-2/3 mx-auto rounded-md border-0 py-1.5 px-2 text-gray-900 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Số tiền tối thiểu */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Số tiền tối thiểu
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setMinimumPurchaseAmount(e.target.value)}
                    placeholder="Số tiền tối thiểu"
                    className=" w-2/3 mx-auto rounded-md border-0 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {/* Số lần sử dụng tối đa */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Số lần sử dụng tối đa
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setMaxUsage(e.target.value)}
                    placeholder="Số lần sử dụng tối đa"
                    className=" w-2/3 mx-auto rounded-md border-0 py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                onClick={() => setCouponIsOpen(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Tạo mã
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
