// atoms/favoritesAtom.js
import { atom, selector } from "recoil";
import { getCartById } from "../service/cartService";

// Atom quản lý giỏ hàng
export const cartItemProductsAtom = atom({
  key: "cartItemProductsAtom", // ID duy nhất
  default: selector({
    key: "cartItemProductsSelector", // Tên selector
    get: async () => {
      try {
        const response = await getCartById();
        // Trả về tổng số lượng sản phẩm trong giỏ hàng
        return response.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu giỏ hàng:", error);
        return 0; // Trả về giá trị mặc định nếu có lỗi
      }
    },
  }),
});
