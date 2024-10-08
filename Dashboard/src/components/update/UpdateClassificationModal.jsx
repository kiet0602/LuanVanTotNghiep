import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { updateClassification } from "../../service/classificationService.js";
import { NotebookTabs } from "lucide-react";
import { toast } from "react-toastify";

export default function UpdateClassificationModal({
  fetchClassifications,
  isOpenUpdate,
  setIsOpenUpdate,
  classification,
}) {
  const [classificationName, setClassificationName] = useState("");

  useEffect(() => {
    if (classification) {
      setClassificationName(classification.classificationName); // Cập nhật giá trị cho input
    }
  }, [classification]);

  const handleUpdateClassification = async (e) => {
    e.preventDefault();
    if (!classificationName.trim()) {
      toast.error("Tên họ cây không được để trống.");
      return; // Dừng nếu không có tên
    }
    try {
      await updateClassification(classification._id, classificationName);
      toast.success("Cập nhật thành công họ cây.");
      fetchClassifications();
      setIsOpenUpdate(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Cập nhật không thành công. Vui lòng thử lại.");
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
                    <NotebookTabs className="mr-2" color="#22C55E" /> Chỉnh sửa
                    họ cây
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
                      Tên họ cây
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          name="username"
                          type="text"
                          value={classificationName} // Sử dụng classificationName để quản lý giá trị
                          onChange={(e) =>
                            setClassificationName(e.target.value)
                          }
                          placeholder="Tên họ cây"
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
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
                onClick={handleUpdateClassification}
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
