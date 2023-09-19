import { createAsyncThunk } from "@reduxjs/toolkit";
import {
getSalary as getSalaryApi,
createUpdateSalary as createUpdateSalaryApi,
deleteSalary as deleteSalaryApi,
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const createUpdateSalary = createAsyncThunk("salary/createUpdateSalary", async (data) => {
  try {
    const response = await createUpdateSalaryApi(data);
    return response;
  }
  catch (error) {
    console.log("error createUpdateSalary",error)
    toast.error("Salary Post Failed", { autoClose: 3000 });
    return error;
  }
});

export const getSalary = createAsyncThunk("salary/getSalary", async (year) => {
  try {
    const response = await getSalaryApi(year);
    console.log(response)
    return response;
  }
  catch (error) {
    toast.error("Salary Get Failed", { autoClose: 3000 });
    return error;
  }
});


export const deleteSalary = createAsyncThunk("salary/deleteSalary", async (id) => {
  try {
    const response = deleteSalaryApi(id);
    return response;
  }
  catch (error) {
    toast.error("Invoice Delete Failed", { autoClose: 3000 });
    return error;
  }
});
