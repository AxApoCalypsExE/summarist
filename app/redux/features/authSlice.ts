import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FirebaseApp } from "firebase/app";

interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    isAnonymous: boolean;
  } | null;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
};

export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async (app: FirebaseApp, { rejectWithValue }) => {
    try {
      const auth = getAuth(app);
      return new Promise<AuthState["user"] | null>((resolve, reject) => {
        onAuthStateChanged(
          auth,
          (user) => {
            if (user) {
              resolve({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                isAnonymous: user.isAnonymous,
              });
            } else {
              resolve(null);
            }
          },
          (error) => {
            rejectWithValue(error.message);
            reject(error);
          }
        );
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<AuthState["user"]>) {
      state.user = action.payload;
      state.loading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    signupSuccess(state, action: PayloadAction<AuthState["user"]>) {
      state.user = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { loginStart, loginSuccess, loginFailure, signupSuccess, logout } =
  authSlice.actions;

export default authSlice.reducer;
