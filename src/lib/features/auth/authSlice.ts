import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface IUser {
  id: number;
  name: string;
  email: string;
};

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  isAuthenticated: false,
  currentUser:
    (typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("currentUser") as string)) ||
    null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    removeCurrentUser: (state) => {
      state.currentUser = null;
    },

    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      if (typeof window !== "undefined") { // Client-side check
        if (action.payload) {
          localStorage.setItem("currentUser", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("currentUser");
        }
      }
    },
  },
});

export const { setAuthenticated, removeCurrentUser, setCurrentUser } =
  authSlice.actions;
export default authSlice.reducer;

// Update the top User type definition (lines 4-20)
export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }>;
};

// Remove the duplicate User interface at the bottom (lines 53-69)
