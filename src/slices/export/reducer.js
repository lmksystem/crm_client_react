import { createSlice } from "@reduxjs/toolkit";
import {
  dowloadExport,
} from "./thunk";

export const initialState = {
  export: [],
};

const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(dowloadExport.fulfilled, (state, action) => {
   
    });

    builder.addCase(dowloadExport.rejected, (state, action) => {
     
    });
  },
});

export default exportSlice.reducer;
