import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false, // mobile drawer
  onlineUserIds: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUserIds = action.payload;
    },
  },
});

export const { toggleSidebar, closeSidebar, setOnlineUsers } = uiSlice.actions;
export default uiSlice.reducer;