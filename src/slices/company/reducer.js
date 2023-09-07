import { createSlice } from "@reduxjs/toolkit";
import {  getCompany } from './thunk';

export const initialState = {
  company: {},
  error: {}
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

    // builder.addCase(addNewCompany.fulfilled, (state, action) => {
    //   state.company.push(action.payload);
    //   state.isCompanyCreated = false;
    //   state.isCompanySuccess = true;
    // });

    // builder.addCase(addNewCompany.rejected, (state, action) => {
    //   state.error = action.payload.error || null;
    //   state.isCompanyCreated = false;
    //   state.isCompanySuccess = false;
    // });

  },
});

export default companySlice.reducer;