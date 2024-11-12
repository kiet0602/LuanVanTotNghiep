import { atom } from "recoil";

const userAtom = atom({
  key: "userTokenAtom",
  default: localStorage.getItem("token" || null),
});

export default userAtom;
