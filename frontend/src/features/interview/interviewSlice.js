import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { interviewApi } from "../../api/interviewApi";
import { extractErrorMessage } from "../../api/axiosClient";

const initialState = {
  interviews: [],
  currentInterview: null,
  lastFeedback: null, // { questionIndex, score, feedback, improvementTip } - most recent answer's feedback
  listStatus: "idle",
  startStatus: "idle",
  answerStatus: "idle",
  completeStatus: "idle",
  error: null,
};

export const fetchInterviews = createAsyncThunk("interview/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await interviewApi.getAll();
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchInterviewById = createAsyncThunk("interview/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await interviewApi.getById(id);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const startInterview = createAsyncThunk("interview/start", async ({ role, difficulty }, { rejectWithValue }) => {
  try {
    return await interviewApi.start({ role, difficulty });
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const submitAnswer = createAsyncThunk(
  "interview/submitAnswer",
  async ({ id, questionIndex, answer }, { rejectWithValue }) => {
    try {
      const result = await interviewApi.submitAnswer(id, questionIndex, answer);
      return { ...result, answerText: answer };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const completeInterview = createAsyncThunk("interview/complete", async (id, { rejectWithValue }) => {
  try {
    return await interviewApi.complete(id);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    clearCurrentInterview: (state) => {
      state.currentInterview = null;
      state.lastFeedback = null;
    },
    clearInterviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.interviews = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchInterviewById.fulfilled, (state, action) => {
        state.currentInterview = action.payload;
      })
      .addCase(startInterview.pending, (state) => {
        state.startStatus = "loading";
        state.error = null;
        state.lastFeedback = null;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.startStatus = "succeeded";
        state.currentInterview = action.payload;
        state.interviews = [action.payload, ...state.interviews];
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.startStatus = "failed";
        state.error = action.payload;
      })
      .addCase(submitAnswer.pending, (state) => {
        state.answerStatus = "loading";
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.answerStatus = "succeeded";
        const { questionIndex, score, feedback, improvementTip, answerText } = action.payload;
        state.lastFeedback = { questionIndex, score, feedback, improvementTip };
        if (state.currentInterview?.questions?.[questionIndex]) {
          state.currentInterview.questions[questionIndex].answer = answerText;
          state.currentInterview.questions[questionIndex].feedback = feedback;
          state.currentInterview.questions[questionIndex].score = score;
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.answerStatus = "failed";
        state.error = action.payload;
      })
      .addCase(completeInterview.pending, (state) => {
        state.completeStatus = "loading";
      })
      .addCase(completeInterview.fulfilled, (state, action) => {
        state.completeStatus = "succeeded";
        state.currentInterview = action.payload;
        state.interviews = state.interviews.map((i) => (i._id === action.payload._id ? action.payload : i));
      })
      .addCase(completeInterview.rejected, (state, action) => {
        state.completeStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCurrentInterview, clearInterviewError } = interviewSlice.actions;
export default interviewSlice.reducer;