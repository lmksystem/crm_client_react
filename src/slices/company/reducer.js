import { createSlice } from "@reduxjs/toolkit";
import {  createOrUpdateCompany, getCompany, updateCompany } from './thunk';
import { toast } from "react-toastify";

export const initialState = {
  company: {},
  error: {},
  isCompanySuccess:false,
  isCompanyCreated:false,

};

const companySlice = createSlice({
  name: "Company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(getCompany.fulfilled, (state, action) => {
      state.company = action.payload.data;
      state.isCompanyCreated = false;
      state.isCompanySuccess = true;
    });

    builder.addCase(getCompany.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isCompanyCreated = false;
      state.isCompanySuccess = false;
    });

    builder.addCase(createOrUpdateCompany.fulfilled, (state, action) => {
  
    });

    builder.addCase(createOrUpdateCompany.rejected, (state, action) => {
  
    });

    builder.addCase(updateCompany.fulfilled, (state, action) => {
      state.company = action.payload.data;
      toast.success("Mise à jour d'entrerpise résussie", { autoClose: 3000 })
      state.isCompanySuccess = true;

    });

    builder.addCase(updateCompany.rejected, (state, action) => {
      state.error = action.payload.error || null;
  
    });

  },
});

export default companySlice.reducer;