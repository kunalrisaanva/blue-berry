import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import {
  loadCartFromLocalStorage,
  saveCartToLocalStorage,
} from "@/lib/localStorageUtils";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: {
      items: loadCartFromLocalStorage(),
    },
  },
});

store.subscribe(() => {
  const state = store.getState();
  saveCartToLocalStorage(state.cart.items);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
