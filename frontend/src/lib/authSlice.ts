import { createSlice } from "@reduxjs/toolkit";


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

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isAdmin: false,
  isOpen: true, // State to track if the profile modal is open
};
const authSlice = createSlice({
  name: "authSlice",  
  initialState,
  reducers: {
    loginSuccess: (state, action) => {  
      // console.log("loginSuccess action payload:--", action.payload);
      const {id,username,email,userimage} = action.payload;
        state.isAuthenticated = true;
        state.user = {id,username,email,userimage};
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
        state.isAdmin = action.payload?.role;
        },
    Logout: (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        state.isAdmin = false;
    }
  },
});


export const { loginSuccess, Logout } = authSlice.actions;

export default authSlice.reducer;