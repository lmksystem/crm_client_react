import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  getEmployees as getEmployeesApi,
  createUpdateEmployee as createUpdateEmployeeApi,
  deleteEmployee as deleteEmployeeApi,
} from "../../helpers/backend_helper";




export const getEmployees = createAsyncThunk("employee/getEmployees", async () => {
    try {
      const response = await getEmployeesApi();
      return response;
    } catch (error) {
      return error;
    }
  });


  export const createUpdateEmployee = createAsyncThunk("employee/createUpdateEmployee", async (data) => {
    try {
      const response = await createUpdateEmployeeApi(data);
      return response;
    } catch (error) {
      return error;
    }
  });


  
  export const deleteEmployee = createAsyncThunk("employee/deleteEmployee", async (id) => {
    try {
      const response = await deleteEmployeeApi(id);
      // console.log()
      return response.data.use_id;
    } catch (error) {
      return error;
    }
  });


//   export const createEmployee = createAsyncThunk("employee/getEmployees", async () => {
//     try {
//       const response = await getEmployeesApi();
//       return response;
//     } catch (error) {
//       return error;
//     }
//   });
  