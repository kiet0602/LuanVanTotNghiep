import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ShoppingBag } from "lucide-react";
import { getAllCategories } from "../../service/categoryService";
import { getAllEnvironments } from "../../service/eviomentService";
import { getAllColors } from "../../service/colorService";
import { addProduct } from "../../service/productService";

export default function AddProduct({ isOpen, setIsOpen, onAdd }) {
  const [categories, setCategories] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [colors, setColors] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [nameProduct, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [size, setSize] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [care, setCare] = useState("");
  const [discount, setDiscount] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch Categories:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchEnvironments = async () => {
    try {
      const data = await getAllEnvironments();
      setEnvironments(data);
    } catch (error) {
      console.error("Failed to fetch Environments:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchColors = async () => {
    try {
      const data = await getAllColors();
      setColors(data);
    } catch (error) {
      console.error("Failed to fetch Colors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchEnvironments();
    fetchColors();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevImages) => [...prevImages, ...imageUrls]);
    setImages((prevImages) => [...prevImages, ...files]); // Lưu trữ đối tượng file cho FormData
  };

  const removeImage = (index) => {
    setImagePreviews((prevImages) => {
      if (!Array.isArray(prevImages)) return []; // Đảm bảo là mảng
      return prevImages.filter((_, i) => i !== index);
    });
    setImages((prevImages) => {
      if (!Array.isArray(prevImages)) return []; // Đảm bảo là mảng
      return prevImages.filter((_, i) => i !== index); // Xóa khỏi mảng images
    });
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append("productName", nameProduct);
    formData.append("category", selectedCategory);
    formData.append("environment", selectedEnvironment);
    formData.append("color", selectedColor);
    formData.append("description", description);
    formData.append("originalPrice", originalPrice);
    formData.append("discount", discount);
    formData.append("size", size);
    formData.append("quantity", quantity);
    formData.append("care", care);

    images.forEach((image) => {
      formData.append("image", image); // Thay đổi thành "image" nếu multer định nghĩa như vậy
    });

    try {
      const newProduct = await addProduct(formData); // Call your API function to add the product
      onAdd(newProduct);
      setImages([]);
      setImagePreviews([]);
      setSelectedCategory("");
      setSelectedEnvironment("");
      setSelectedColor("");
      setIsOpen(false); // Close the modal
    } catch (error) {
      console.error("Failed to add product:", error);
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
        <Dialog.Panel className="w-full max-w-5xl bg-white p-6 rounded-lg overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="border-b border-gray-900/10 pb-12 text-center">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                    <ShoppingBag className="mr-2" color="#8B5CF6" /> Thêm sản
                    phẩm
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Tên sản phẩm
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          name="username"
                          type="text"
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="Tên sản phẩm"
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Số lượng
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          name="username"
                          type="number"
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="Số lượng sản phẩm"
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Mô tả sản phẩm
                    </label>
                    <div className="mt-2">
                      <textarea
                        placeholder="Mô tả sản phẩm"
                        id="about"
                        name="about"
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Thêm ảnh
                    </label>
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
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">tối đa 4 ảnh</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-4 flex-wrap">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative inline-block">
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Thể loại
                    </label>
                    <div className="mt-2">
                      <select
                        id="category"
                        name="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Chọn thể loại</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="environment"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Môi trường sống
                    </label>
                    <div className="mt-2">
                      <select
                        id="environment"
                        name="environment"
                        value={selectedEnvironment}
                        onChange={(e) => setSelectedEnvironment(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Chọn môi trường</option>
                        {environments.map((environment) => (
                          <option key={environment._id} value={environment._id}>
                            {environment.nameEnviroment}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="color"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Màu sắc
                    </label>
                    <div className="mt-2">
                      <select
                        id="color"
                        name="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Chọn màu sắc</option>
                        {colors.map((color) => (
                          <option key={color._id} value={color._id}>
                            {color.nameColor}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Mức độ chăm sóc
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => setCare(e.target.value)}
                        placeholder="Mức độ chăm sóc"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Kích cỡ
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Kích cỡ cây"
                        id="city"
                        name="city"
                        type="text"
                        onChange={(e) => setSize(e.target.value)}
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Giá sản phẩm
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Giá sản phẩm"
                        id="region"
                        name="region"
                        type="number"
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Khuyến mãi
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="Phần trăm giảm giá"
                        id="postal-code"
                        name="postal-code"
                        type="number"
                        onChange={(e) => setDiscount(e.target.value)}
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
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