import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resumeApi } from "../../api/resumeApi";
import { aiApi } from "../../api/aiApi";
import { extractErrorMessage } from "../../api/axiosClient";

const initialState = {
  resumes: [],
  activeResume: null,
  currentResume: null,
  listStatus: "idle",
  activeStatus: "idle", // idle | loading | succeeded | failed | none
  uploadStatus: "idle",
  analysisStatus: "idle",
  error: null,
};

export const uploadResume = createAsyncThunk("resume/upload", async (file, { rejectWithValue }) => {
  try {
    return await resumeApi.upload(file);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchResumes = createAsyncThunk("resume/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await resumeApi.getAll();
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchActiveResume = createAsyncThunk("resume/fetchActive", async (_, { rejectWithValue }) => {
  try {
    return await resumeApi.getActive();
  } catch (err) {
    if (err?.response?.status === 404) return null; // no resume yet - not a real error
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchResumeById = createAsyncThunk("resume/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await resumeApi.getById(id);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteResume = createAsyncThunk("resume/delete", async (id, { rejectWithValue }) => {
  try {
    await resumeApi.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const analyzeResume = createAsyncThunk("resume/analyze", async (resumeId, { rejectWithValue }) => {
  try {
    const aiAnalysis = await aiApi.analyzeResume(resumeId);
    return { resumeId, aiAnalysis };
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const applyAnalysis = (resume, resumeId, aiAnalysis) =>
  resume && resume._id === resumeId ? { ...resume, aiAnalysis } : resume;

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    clearResumeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.uploadStatus = "loading";
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.activeResume = action.payload;
        state.currentResume = action.payload;
        state.activeStatus = "succeeded";
        state.resumes = [action.payload, ...state.resumes.filter((r) => r._id !== action.payload._id)];
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchResumes.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchActiveResume.pending, (state) => {
        state.activeStatus = "loading";
      })
      .addCase(fetchActiveResume.fulfilled, (state, action) => {
        state.activeStatus = action.payload ? "succeeded" : "none";
        state.activeResume = action.payload;
      })
      .addCase(fetchActiveResume.rejected, (state, action) => {
        state.activeStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchResumeById.pending, (state) => {
        state.currentResume = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.currentResume = action.payload;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r._id !== action.payload);
        if (state.activeResume?._id === action.payload) {
          state.activeResume = null;
          state.activeStatus = "none";
        }
        if (state.currentResume?._id === action.payload) {
          state.currentResume = null;
        }
      })
      .addCase(analyzeResume.pending, (state) => {
        state.analysisStatus = "loading";
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.analysisStatus = "succeeded";
        const { resumeId, aiAnalysis } = action.payload;
        state.activeResume = applyAnalysis(state.activeResume, resumeId, aiAnalysis);
        state.currentResume = applyAnalysis(state.currentResume, resumeId, aiAnalysis);
        state.resumes = state.resumes.map((r) => applyAnalysis(r, resumeId, aiAnalysis));
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.analysisStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearResumeError } = resumeSlice.actions;
export default resumeSlice.reducer;