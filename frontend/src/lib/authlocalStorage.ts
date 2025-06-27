// utils/authStorage.ts

export const saveAuthToLocalStorage = (token: string, user: any) => {
  try {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
  } catch (err) {
    console.error("Auth save failed", err);
  }
};

export const loadAuthFromLocalStorage = () => {
  try {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
    };
  } catch {
    return { token: null, user: null };
  }
};

export const clearAuthFromLocalStorage = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};
