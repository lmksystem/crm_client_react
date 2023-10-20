import { createSlice } from "@reduxjs/toolkit";
import { createOrUpdateUser, getUser } from "./thunk";

export const initialState = {
  users: [],
  error: {},
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.users = action.payload.data;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.error = action.payload || null;
    });
   
    builder.addCase(createOrUpdateUser.fulfilled, (state, action) => {
      state.users.push(action.payload.data);
    });
    builder.addCase(createOrUpdateUser.rejected, (state, action) => {
      state.error = action.payload || null;
    });
  }
});

export default adminSlice.reducer;
