import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Rainbow } from "lucide-react";
import { updateColorById } from "../../service/colorService.js";
import { toast } from "react-toastify";

export default function UpdateColorModal({
  fetchDataColor,
  isOpenUpdate,
  setIsOpenUpdate,
  color,
}) {
  const [colorName, setColorName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (color) {
      setColorName(color?.nameColor); // Cập nhật giá trị cho input
    }
  }, [color]);

  const handleUpdateColor = async (e) => {
    e.preventDefault();
    if (!colorName.trim()) {
      toast.error("Màu sắc không được để trống!");
      return; // Ngừng thực hiện nếu trống
    }
    try {
      await updateColorById(color._id, {
        nameColor: colorName,
      });
      setIsOpenUpdate(false);
      toast.success("Đã cập nhật thành công màu sắc");
      fetchDataColor();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Cập nhật thất bại:", error);
    }
  };
  // validate màu
  const handleInputChange = (e) => {
    const input = e.target.value;
    const regex = /^[^\d]*$/; // Không cho phép nhập số
    if (regex.test(input)) {
      setColorName(input); // Cập nhật trạng thái nếu input hợp lệ
      setError(""); // Xóa lỗi nếu có
    } else {
      setError("Chỉ cho phép nhập chữ cái, dấu tiếng Việt và khoảng trắng.");
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
        <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded-lg overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {/* Form */}
          <form>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="border-b border-gray-900/10 pb-12 text-center">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                    <Rainbow className="mr-2" color="#F43F5E" /> Chỉnh sửa màu
                    sắc
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Màu sắc
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          name="username"
                          type="text"
                          value={colorName} // Sử dụng classificationName để quản lý giá trị
                          onChange={handleInputChange}
                          placeholder="Màu sắc"
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}{" "}
                  </div>
                </div>
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
                onClick={handleUpdateColor}
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
