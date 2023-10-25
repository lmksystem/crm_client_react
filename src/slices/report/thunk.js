import { createAsyncThunk } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  getReportData as getReportDataApi
} from "../../helpers/backend_helper";




export const getReportData = createAsyncThunk("report/getReportData", async (data) => {
  try {
    const response = await getReportDataApi(data);
    return response;
  } catch (error) {
    return error;
  }
});
