import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  getCompany as getCompanyApi,
  createOrUpdateCompany as createOrUpdateCompanyApi,
  updateCompany as updateCompanyApi,
} from "../../helpers/backend_helper";

export const getCompany = createAsyncThunk(
  "company/getCompany",
  async () => {
    try {
      const response = await getCompanyApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const createOrUpdateCompany = createAsyncThunk(
  "company/createOrUpdateCompany",
  async (data) => {
    try {
      const response = createOrUpdateCompanyApi(data);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (data) => {
    try {
      const response = await updateCompanyApi(data);
      return response;
    } catch (error) {
      return error;
    }
  }
);

