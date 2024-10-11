import { atom } from "recoil";
const userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("userCurrent" || null)),
});

export default userAtom;
