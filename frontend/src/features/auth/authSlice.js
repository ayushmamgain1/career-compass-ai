import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import { tokenStorage, extractErrorMessage } from "../../api/axiosClient";
import { disconnectSocket } from "../../lib/socket";

const existingToken = tokenStorage.get();

const initialState = {
  user: null,
  token: existingToken || null,
  isAuthenticated: Boolean(existingToken),
  status: "idle",
  bootstrapped: !existingToken,
  error: null,
};

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.register(payload);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.login(payload);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    return await authApi.getProfile();
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.updateProfile(payload);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.bootstrapped = true;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.bootstrapped = true;
        tokenStorage.set(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.bootstrapped = true;
        tokenStorage.set(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.isAuthenticated = true;
        state.bootstrapped = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
        tokenStorage.clear();
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  },
});

export const { loggedOut, clearAuthError } = authSlice.actions;

export const logout = () => (dispatch) => {
  tokenStorage.clear();
  disconnectSocket();
  dispatch(loggedOut());
};

export default authSlice.reducer;