// atoms.js
import { atom } from "recoil";

export const selectedPaymentMethodState = atom({
  key: "selectedPaymentMethodState",
  default: null,
});

export const selectedShippingMethodState = atom({
  key: "selectedShippingMethodState",
  default: null,
});
