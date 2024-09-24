import { useEffect, useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { LeafyGreen } from "lucide-react";
import { getClassifications } from "../../service/classificationService";
import { updateCategory } from "../../service/categoryService";

export default function UpdateCategoryModal({
  isOpenUpdate,
  setIsOpenUpdate,
  category,
}) {
  const fileInputRef = useRef(null);
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [descriptionCategory, setDescriptionCategory] = useState("");
  const [classification, setClassification] = useState("");
  const [imageCategory, setImageCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const data = await getClassifications();
        setClassifications(data);
      } catch (error) {
        console.error("Failed to fetch classifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassifications();
  }, []);

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName);
      setDescriptionCategory(category.descriptionCategory);
      setClassification(category.classification._id); // Assuming classification is an object
      setImageCategory(category.imageCategory);
    }
  }, [category]);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    setClassification(selectedId); // Cập nhật state classification với ID đã chọn
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageCategory(file); // Lưu trữ tệp hình ảnh
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null); // Reset nếu không có file
    }
  };

  const handleChangeImage = () => {
    setImageCategory(null); // Reset imageCategory
    setImagePreview(null); // Reset imagePreview
    document.getElementById("file-upload").value = ""; // Clear file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = {
      categoryName,
      descriptionCategory,
      classification,
      imageCategory, // Đây có thể là file nếu người dùng thay đổi ảnh
    };

    try {
      const updatedCategory = await updateCategory(category._id, categoryData);
      setIsOpenUpdate(false); // Đóng modal sau khi cập nhật thành công
      // Xử lý logic sau khi cập nhật thành công
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  return (
    <Dialog
      open={isOpenUpdate}
      onClose={() => setIsOpenUpdate(false)}
      className="relative z-50"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-5xl bg-white p-6 rounded-lg overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="border-b border-gray-900/10 pb-12 text-center">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                    <LeafyGreen className="mr-2" color="#D97706" /> Thêm thể
                    loại
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
                      Tên thể loại
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="Màu sắc"
                          value={categoryName} // Hiển thị tên thể loại từ state
                          onChange={(e) => setCategoryName(e.target.value)}
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="category-select"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Chọn họ cây
                      </label>
                      <select
                        id="category-select"
                        value={classification} // Hiển thị họ cây từ state
                        onChange={handleSelectChange}
                        className="block w-full rounded-md border-0 bg-transparent py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Chọn một họ cây</option>
                        {loading ? (
                          <option disabled>Loading...</option>
                        ) : (
                          classifications.map((classification) => (
                            <option
                              key={classification._id}
                              value={classification._id}
                            >
                              {classification.classificationName}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Mô tả thể loại
                    </label>
                    <textarea
                      id="about"
                      rows={3}
                      value={descriptionCategory} // Hiển thị mô tả thể loại từ state
                      onChange={(e) => setDescriptionCategory(e.target.value)}
                      placeholder="Mô tả thể loại"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cover photo
                    </label>
                    {category?.imageCategory && (
                      <div className="mt-4 flex flex-col items-center justify-center">
                        <img
                          src={`http://localhost:2000/images/${category.imageCategory}`}
                          alt="Preview"
                          className="rounded-lg"
                          height={"200px"}
                          width={"200px"}
                        />
                      </div>
                    )}
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Upload ảnh thay đổi
                    </label>
                    {imagePreview ? (
                      <div className="mt-4 flex flex-col items-center justify-center">
                        <img
                          src={imagePreview}
                          className="rounded-lg"
                          height={"200px"}
                          width={"200px"}
                        />
                        <button
                          type="button"
                          onClick={handleChangeImage}
                          className="mt-2 text-sm font-semibold text-indigo-600"
                        >
                          Thay đổi hình ảnh
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <PhotoIcon
                            aria-hidden="true"
                            className="mx-auto h-12 w-12 text-gray-300"
                          />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                type="file"
                                onChange={handleImageChange}
                                className="sr-only"
                                ref={fileInputRef}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => setIsOpenUpdate(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Thêm
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
