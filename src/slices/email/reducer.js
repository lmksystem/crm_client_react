import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
import moment from "moment";
import {getEmail } from "./thunk";
moment.locale('fr')

export const initialState = {
  emails: [],
  error: {},
  isEmailSuccess: false,
};

const emailSlice = createSlice({
  name: "Email",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getEmail.fulfilled, (state, action) => {
      state.isEmailSuccess = true;
      state.emails = action.payload.data || [];
    });
    builder.addCase(getEmail.rejected, (state, action) => {
      state.isEmailSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });    

  }
});

export default emailSlice.reducer;
