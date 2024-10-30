// atoms/favoritesAtom.js
import { atom } from "recoil";

export const cartItemProducts = atom({
  key: "cartItemProductsAtom", // ID duy nhất (so với các atom/selectors khác)
  default: [], // giá trị mặc định (trạng thái ban đầu)
});

export const cartItemProductsCount = atom({
  key: "cartItemProductsCountAtom",
  default: JSON.parse(localStorage.getItem("cartCount")) || 0,
});

export const clearCartCount = () => {
  localStorage.removeItem("cartCount");
};
