import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import moment from "moment";
import { getReportData } from "./thunk";
moment.locale('fr')

export const initialState = {
  report: [],
  error: {},
  isReportSuccess: false,
};

const salarySlice = createSlice({
  name: "Report",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getReportData.fulfilled, (state, action) => {
      state.isReportSuccess = true;
      state.report = action.payload.data;
    });
    builder.addCase(getReportData.rejected, (state, action) => {
      toast.error('Erreur d\'ajout !', { autoClose: 3000 })
      state.isReportSuccess = false;
      state.error = action.payload || "Erreur lors de la récupération !"
    });
  }
});

export default salarySlice.reducer;
