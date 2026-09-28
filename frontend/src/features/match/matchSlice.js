import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { matchApi } from "../../api/matchApi";
import { extractErrorMessage } from "../../api/axiosClient";

const initialState = {
  currentMatch: null,
  matchStatus: "idle",
  bulkResults: [],
  bulkStatus: "idle",
  error: null,
};

export const matchResumeToJob = createAsyncThunk("match/matchOne", async (jobId, { rejectWithValue }) => {
  try {
    return await matchApi.matchResumeToJob(jobId);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const bulkSkillGap = createAsyncThunk("match/bulk", async (jobIds, { rejectWithValue }) => {
  try {
    return await matchApi.bulkSkillGap(jobIds);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
      state.matchStatus = "idle";
    },
    clearMatchError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(matchResumeToJob.pending, (state) => {
        state.matchStatus = "loading";
        state.error = null;
      })
      .addCase(matchResumeToJob.fulfilled, (state, action) => {
        state.matchStatus = "succeeded";
        state.currentMatch = action.payload;
      })
      .addCase(matchResumeToJob.rejected, (state, action) => {
        state.matchStatus = "failed";
        state.error = action.payload;
      })
      .addCase(bulkSkillGap.pending, (state) => {
        state.bulkStatus = "loading";
      })
      .addCase(bulkSkillGap.fulfilled, (state, action) => {
        state.bulkStatus = "succeeded";
        state.bulkResults = action.payload;
      })
      .addCase(bulkSkillGap.rejected, (state, action) => {
        state.bulkStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCurrentMatch, clearMatchError } = matchSlice.actions;
export default matchSlice.reducer;