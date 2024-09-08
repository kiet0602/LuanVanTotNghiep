// atoms/favoritesAtom.js
import { atom, selector } from "recoil";

export const favoritesAtom = atom({
  key: "favoritesAtom", // ID duy nhất (so với các atom/selectors khác)
  default: [], // giá trị mặc định (trạng thái ban đầu)
});

export const favoritesCountAtom = atom({
  key: "favoritesCountAtom",
  default: JSON.parse(localStorage.getItem("favoritesCount")) || 0,
});

export const clearFavoritesCount = () => {
  localStorage.removeItem("favoritesCount");
};
