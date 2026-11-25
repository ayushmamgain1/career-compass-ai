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
  resendStatus: "idle",
  bootstrapped: !existingToken,
  error: null,
};

const createAuthThunk = (type, request) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await request(arg);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  });

export const registerUser = createAuthThunk("auth/register", authApi.register); // emails the OTP
export const verifyOtp = createAuthThunk("auth/verifyOtp", authApi.verifyOtp); // creates the account + signs in
export const resendOtp = createAuthThunk("auth/resendOtp", authApi.resendOtp);
export const googleLogin = createAuthThunk("auth/google", authApi.googleLogin);
export const loginUser = createAuthThunk("auth/login", authApi.login);
export const fetchProfile = createAuthThunk("auth/fetchProfile", authApi.getProfile);
export const updateProfile = createAuthThunk("auth/updateProfile", authApi.updateProfile);

const startLoading = (state) => {
  state.status = "loading";
  state.error = null;
};

const failWith = (state, action) => {
  state.status = "failed";
  state.error = action.payload;
};

const signIn = (state, action) => {
  state.status = "succeeded";
  state.user = action.payload;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  state.bootstrapped = true;
  tokenStorage.set(action.payload.token);
};

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
      .addCase(registerUser.pending, startLoading)
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, failWith)

      .addCase(verifyOtp.pending, startLoading)
      .addCase(verifyOtp.fulfilled, signIn)
      .addCase(verifyOtp.rejected, failWith)
      .addCase(googleLogin.pending, startLoading)
      .addCase(googleLogin.fulfilled, signIn)
      .addCase(googleLogin.rejected, failWith)
      .addCase(loginUser.pending, startLoading)
      .addCase(loginUser.fulfilled, signIn)
      .addCase(loginUser.rejected, failWith)

      .addCase(resendOtp.pending, (state) => {
        state.resendStatus = "loading";
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendStatus = "succeeded";
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendStatus = "failed";
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

      .addCase(updateProfile.pending, startLoading)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, failWith);
  },
});

export const { loggedOut, clearAuthError } = authSlice.actions;

export const logout = () => (dispatch) => {
  tokenStorage.clear();
  disconnectSocket();
  dispatch(loggedOut());
};

export default authSlice.reducer;