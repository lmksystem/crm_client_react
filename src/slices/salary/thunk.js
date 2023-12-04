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
    toast.error("Erreur d'ajout / mise à jour de salaire", { autoClose: 3000 });
    return error;
  }
});

export const getSalary = createAsyncThunk("salary/getSalary", async (year) => {
  try {
    const response = await getSalaryApi(year);
    return response;
  }
  catch (error) {
    toast.error("Erreur de récupération de salaire", { autoClose: 3000 });
    return error;
  }
});


export const deleteSalary = createAsyncThunk("salary/deleteSalary", async (id) => {
  try {
    const response = await deleteSalaryApi(id);
    return response;
  }
  catch (error) {
    toast.error("Erreur sur la suppression d'un salaire", { autoClose: 3000 });
    return error;
  }
});
