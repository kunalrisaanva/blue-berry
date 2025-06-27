import { createSlice } from "@reduxjs/toolkit";
import {
  saveAuthToLocalStorage,
  loadAuthFromLocalStorage,
  clearAuthFromLocalStorage,
} from "@/lib/authlocalStorage";

interface User {
  id: any;
  username: any;
  email: any;
  userimage: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: any;
  isAdmin: boolean;
  isOpen: boolean;
}

const localData = loadAuthFromLocalStorage();

const initialState: AuthState = {
  isAuthenticated: !!localData.token,
  user: localData.user,
  token: localData.token,
  loading: false,
  error: null,
  isAdmin: false,
  isOpen: true,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log("google login action payload:", action.payload);
      const { id, username, email, userimage, token, role } = action.payload;
      state.isAuthenticated = true;
      state.user = { id, username, email, userimage };
      state.token = token;
      state.isAdmin = role;
      state.loading = false;
      state.error = null;

      saveAuthToLocalStorage(token, { id, username, email, userimage });
    },
    Logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAdmin = false;

      clearAuthFromLocalStorage();
    },

    googleLoginSuccess: (state, action) => {
      console.log("google login action payload:", action.payload);
      const { id, username, email, userimage, token, role } = action.payload;
      state.isAuthenticated = true;
      state.user = { id, username, email, userimage };
      state.token = token;
      state.isAdmin = role;
      state.loading = false;
      state.error = null;
      saveAuthToLocalStorage(token, { id, username, email, userimage });
    },

    // setUserDetails: (state, action) => {
    //   const { id, username, email } = action.payload;
    //   state.user = { id, username, email,  };
    //   saveAuthToLocalStorage(state.token!, { id, username, email });
    // }
  },
});

export const { loginSuccess, Logout, googleLoginSuccess } = authSlice.actions;
export default authSlice.reducer;
