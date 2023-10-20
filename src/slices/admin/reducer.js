import { createSlice } from "@reduxjs/toolkit";
import { createOrUpdateUser, deleteUser, getUser } from "./thunk";

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
  
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter( (u) => { console.log(u.use_id != action.payload.data.use_id);return u.use_id != action.payload.data.use_id});
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.error = action.payload || null;
    });
  }
});

export default adminSlice.reducer;
