import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jobApi } from "../../api/jobApi";
import { extractErrorMessage } from "../../api/axiosClient";

const initialState = {
  recommendations: [],
  allJobs: [],
  searchResults: [],
  currentJob: null,
  recommendationsStatus: "idle",
  allJobsStatus: "idle",
  searchStatus: "idle",
  jobStatus: "idle",
  error: null,
};

export const fetchRecommendations = createAsyncThunk("jobs/fetchRecommendations", async (_, { rejectWithValue }) => {
  try {
    return await jobApi.getRecommendations();
  } catch (err) {
    if (err?.response?.status === 404) return []; // no active resume yet
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchAllJobs = createAsyncThunk("jobs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await jobApi.getAll();
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const searchJobs = createAsyncThunk("jobs/search", async ({ query, location }, { rejectWithValue }) => {
  try {
    return await jobApi.search(query, location);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchJobById = createAsyncThunk("jobs/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await jobApi.getById(id);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchStatus = "idle";
    },
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.recommendationsStatus = "loading";
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendationsStatus = "succeeded";
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.recommendationsStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllJobs.pending, (state) => {
        state.allJobsStatus = "loading";
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.allJobsStatus = "succeeded";
        state.allJobs = action.payload;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.allJobsStatus = "failed";
        state.error = action.payload;
      })
      .addCase(searchJobs.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.jobStatus = "loading";
        state.currentJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobStatus = "succeeded";
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.jobStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults, clearJobError } = jobSlice.actions;
export default jobSlice.reducer;