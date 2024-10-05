"use client";

import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./features/modalSlice";
import authReducer from "./features/authSlice";
import premiumReducer from "./features/premiumSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
    premium: premiumReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;