export const loadCartFromLocalStorage = (): any[] => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const saveCartToLocalStorage = (cartItems: any[]): void => {
  try {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  } catch (err) {
    // error handling
  }
};
