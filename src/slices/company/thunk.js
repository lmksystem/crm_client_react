import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  getCompany as getCompanyApi,
  createOrUpdateCompany as createOrUpdateCompanyApi,
  updateCompany as updateCompanyApi,
  addLicense as addLicenseApi,
  getLicense as getLicenseApi,
  deleteLicense as deleteLicenseApi
} from "../../helpers/backend_helper";
import { updateLogo } from "./reducer";

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

export const addLicense = createAsyncThunk("company/addLicense", (data) => {
  try {
    const response = addLicenseApi(data);
    return response;
  } catch (error) {
    return error;
  }
});

export const getLicense = createAsyncThunk("company/getLicense", () => {
  try {
    const response = getLicenseApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const deleteLicense = createAsyncThunk("company/deleteLicense", (id) => {
  try {
    const response = deleteLicenseApi(id);
    return response;
  } catch (error) {
    return error;
  }
});

export const updateLogoAction = (data) => async (dispatch) => {
  dispatch(updateLogo(data))

}