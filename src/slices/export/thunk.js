import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  dowloadExport as dowloadExportApi,
} from "../../helpers/backend_helper";

// Gestion

// Gestion 

export const dowloadExport = createAsyncThunk("export/dowloadExport", async (data) => {
  try {
    const response = dowloadExportApi(data);
    return response;
  } catch (error) {
    return error;
  }
});


