import { getPremiumStatus } from "@/app/components/choose-plan/getPremiumStatus";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApp } from "firebase/app";
import { RootState } from "../store";

interface PremiumState {
  isPremium: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PremiumState = {
  isPremium: false,
  loading: true,
  error: null,
};

export const fetchPremiumStatus = createAsyncThunk<boolean | undefined, void, { rejectValue: string }>(
  "premium/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const app = getApp();
      const isPremium = await getPremiumStatus(app);
      return isPremium;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(
          error.message || "Failed to fetch premium status"
        );
      } else rejectWithValue("An unknown error occurred");
    }
  }
);

const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    resetPremiumState(state) {
      state.isPremium = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPremiumStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchPremiumStatus.fulfilled, (state, action: PayloadAction<boolean | undefined>) => {
      if (typeof action.payload === "boolean") {
        state.isPremium = action.payload;
      } else {
        state.isPremium = false;
      }
      state.loading = false;
    });

    builder.addCase(fetchPremiumStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});


export const { resetPremiumState } = premiumSlice.actions;
export const selectIsPremium = (state: RootState) => state.premium.isPremium;
export const selectPremiumLoading = (state: RootState) => state.premium.loading;
export const selectPremiumError = (state: RootState) => state.premium.error;

export default premiumSlice.reducer;