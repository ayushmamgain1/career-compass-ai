import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardApi } from "../../api/dashboardApi";
import { extractErrorMessage } from "../../api/axiosClient";

const initialState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchDashboard = createAsyncThunk("dashboard/fetch", async (_, { rejectWithValue }) => {
  try {
    return await dashboardApi.getDashboard();
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;