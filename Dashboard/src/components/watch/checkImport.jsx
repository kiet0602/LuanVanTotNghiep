import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";
import { LeafyGreen } from "lucide-react";

// Chỉ cần import vfsFonts mà không cần định nghĩa font
pdfMake.vfs = vfsFonts.pdfMake.vfs;

export default function Import({ isOpen, setIsOpenSeeImport, oneImport }) {
  if (!oneImport) return null;

  const exportPDF = async () => {
    const element = document.getElementById("bill-content");
    if (!element) {
      toast.error("Không tìm thấy nội dung để xuất PDF");
      return;
    }

    try {
      // Định nghĩa tài liệu PDF
      const docDefinition = {
        content: [
          {
            text: "PHIẾU NHẬP",
            style: "header",
            alignment: "center",
            margin: [0, 20],
          },
          {
            text: "Cửa hàng Plant Paradise",
            style: "subheader",
            alignment: "center",
          },
          {
            text: "Địa chỉ: 3/2 quận Xuân Khánh, Ninh Kiều, Cần Thơ",
            style: "address",
            alignment: "center",
          },
          {
            text: "Số điện thoại: [0123456789]",
            style: "address",
            alignment: "center",
          },
          {
            text:
              "Ngày nhập kho: " +
              new Date(oneImport.createdAt).toLocaleDateString("vi-VN"),
            style: "info",
            margin: [0, 10],
          },
          {
            table: {
              body: [
                ["Nhà cung cấp", oneImport?.supplier],
                ["Mã phiếu nhập", oneImport?._id],
                [
                  "Địa chỉ kho",
                  "3/2, Phường Xuân Khánh, Quận Ninh Kiều, Thành Phố Cần Thơ",
                ],
                [
                  "Ngày nhập kho",
                  new Date(oneImport.createdAt).toLocaleDateString("vi-VN"),
                ],
                ["Tổng số tiền", `${oneImport.totalCost.toLocaleString()} đ`],
              ],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 20],
          },
          {
            text: "Chi tiết sản phẩm nhập kho:",
            style: "subheader",
            margin: [0, 10],
          },
          {
            table: {
              widths: ["*", "auto", "auto"],
              body: [
                ["Tên sản phẩm", "Tổng giá (đ)", "Số lượng"],
                ...oneImport.items.map((item) => [
                  item.product.productName,
                  item.cost.toLocaleString(),
                  item.quantity,
                ]),
              ],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 20],
          },
          {
            text: "Cảm ơn bạn đã cung cấp sản phẩm cho chúng tôi!",
            style: "footer",
            alignment: "center",
            margin: [0, 20],
          },
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            margin: [0, 20],
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 5],
          },
          address: {
            fontSize: 12,
            margin: [0, 5],
          },
          info: {
            fontSize: 12,
            italics: true,
            margin: [0, 5],
          },
          footer: {
            fontSize: 12,
            italics: true,
            margin: [0, 20],
          },
        },
        defaultStyle: {
          // Không cần chỉ định font chữ, mặc định sẽ là Helvetica
        },
      };

      // Tạo và xuất PDF
      pdfMake.createPdf(docDefinition).download("import_bill.pdf");
      toast.success("Xuất PDF thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      toast.error("Có lỗi xảy ra khi xuất PDF.");
    }
  };

  return (
    <Dialog
      open={isOpen}
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
            {/* Nội dung phiếu nhập */}
            <div className="space-y-12" id="bill-content">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="border-b border-gray-900/10 pb-12 text-center">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 flex items-center justify-center">
                    <LeafyGreen className="mr-2" color="#D97706" /> Thông tin
                    phiếu nhập
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Thông tin phiếu nhập đã được hiển thị đầy đủ bên dưới
                  </p>
                </div>
                {/* Thông tin phiếu nhập */}
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Nhà cung cấp
                    </label>
                    <div className="mt-1">{oneImport?.supplier}</div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Mã phiếu nhập
                    </label>
                    <div className="mt-1">{oneImport?._id}</div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ kho
                    </label>
                    <div className="mt-1">
                      3/2, Phường Xuân Khánh, Quận Ninh Kiều, Thành Phố Cần Thơ
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày nhập kho
                    </label>
                    <div className="mt-1">
                      {new Date(oneImport.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tổng số tiền
                    </label>
                    <div className="mt-1">
                      {oneImport.totalCost.toLocaleString()} đ
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mt-4 space-y-4">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left  font-medium text-gray-700">
                            Tên sản phẩm
                          </th>
                          <th className="px-4 py-2 text-left  font-medium text-gray-700">
                            Tổng giá
                          </th>
                          <th className="px-4 py-2 text-left  font-medium text-gray-700">
                            Số lượng nhập
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {oneImport.items?.map((item) => (
                          <tr key={item._id} className="border-b">
                            <td className="px-4 py-2 text-gray-700">
                              {item.product.productName.length > 30
                                ? item.product.productName.slice(0, 30) + "..."
                                : item.product.productName}
                            </td>
                            <td className="px-4 py-2  text-gray-600">
                              {item.cost.toLocaleString()} đ
                            </td>
                            <td className="px-4 py-2  text-gray-600">
                              {item.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-right">
                <button
                  onClick={() => setIsOpenSeeImport(false)}
                  type="button"
                  className=" mr-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Đóng
                </button>
                <button
                  onClick={() => exportPDF()}
                  type="button"
                  className=" inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Xuất PDF
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
