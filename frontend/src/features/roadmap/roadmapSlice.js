import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { roadmapApi } from "../../api/roadmapApi";
import { extractErrorMessage } from "../../api/axiosClient";

const initialState = {
  currentRoadmap: null, // { roadmap: [{ week, topic, description, resources }], estimatedDurationWeeks }
  status: "idle",
  error: null,
};

export const generateRoadmapForJob = createAsyncThunk("roadmap/forJob", async (jobId, { rejectWithValue }) => {
  try {
    return await roadmapApi.createForJob(jobId);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const generateGeneralRoadmap = createAsyncThunk(
  "roadmap/general",
  async (targetSkills, { rejectWithValue }) => {
    try {
      return await roadmapApi.createGeneral(targetSkills);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {
    clearRoadmap: (state) => {
      state.currentRoadmap = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateRoadmapForJob.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateRoadmapForJob.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentRoadmap = action.payload;
      })
      .addCase(generateRoadmapForJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(generateGeneralRoadmap.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateGeneralRoadmap.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentRoadmap = action.payload;
      })
      .addCase(generateGeneralRoadmap.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearRoadmap } = roadmapSlice.actions;
export default roadmapSlice.reducer;