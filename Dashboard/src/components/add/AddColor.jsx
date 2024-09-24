import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Rainbow } from "lucide-react";

import { createColor } from "../../service/colorService";

export default function AddColor({ isOpen, setIsOpen, onAdd }) {
  const [colorName, setColorName] = useState(""); // Trạng thái cho tên phân loại
  const [error, setError] = useState("");

  const handleAddColor = async () => {
    if (!colorName) {
      setError("Màu sắc không được để trống.");
      return; // Không đóng modal nếu tên họ cây trống
    }
    try {
      const newColor = await createColor(colorName);
      onAdd(newColor); // Gọi hàm callback với đối số là phân loại mới
      setColorName(""); // Reset input
      setIsOpen(false); // Đóng modal chỉ khi thêm thành công
      setError(""); // Reset lỗi nếu có
    } catch (error) {
      setError("Lỗi khi thêm họ cây: " + (error.message || error));
    }
  };

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
      open={isOpen}
      onClose={() => setIsOpen(false)}
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
          <div>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="border-b border-gray-900/10 pb-12 text-center">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                    <Rainbow className="mr-2" color="#F43F5E" /> Thêm màu sắc
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
                          id="username"
                          name="username"
                          type="text"
                          placeholder="Màu sắc"
                          value={colorName}
                          onChange={handleInputChange} // Cập nhật trạng thái
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}{" "}
                    {/* Hiển thị lỗi nếu có */}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => setIsOpen(false)} // Đóng modal khi nhấn Cancel
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                onClick={handleAddColor}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
