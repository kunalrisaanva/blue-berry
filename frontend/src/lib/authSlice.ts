import { createSlice } from "@reduxjs/toolkit";


const initialState = {
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
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
        state.isAdmin = action.payload.user.role;
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