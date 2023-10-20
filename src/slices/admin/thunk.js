import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  getUser as getUserApi,
  createOrUpdateUser as createOrUpdateUserApi,
  createOrUpdateUserAdmin as createOrUpdateUserAdminApi,
  deleteUser as deleteUserApi 
} from "../../helpers/backend_helper";




export const getUser = createAsyncThunk("admin/getUser", async () => {
  try {
    const response = await getUserApi();
    return response;
  } catch (error) {
    return error;
  }
});


export const createOrUpdateUser = createAsyncThunk("admin/createOrUpdateUser", (data) => {
  try {
    const response = createOrUpdateUserApi(data);
    return response;
  } catch (error) {
    return error;
  }
});


export const createOrUpdateUserAdmin = createAsyncThunk("admin/createOrUpdateUserAdmin", (data) => {
  try {
    const response = createOrUpdateUserAdminApi(data);
    return response;
  } catch (error) {
    return error;
  }
});

export const deleteUser = createAsyncThunk("admin/deleteUser", (id) => {
  try {
    const response = deleteUserApi(id);
    return response;
  } catch (error) {
    return error;
  }
});



// export const deleteEmployee = createAsyncThunk("employee/deleteEmployee", async (id) => {
//   try {
//     const response = await deleteEmployeeApi(id);
//     console.log()
//     return response.data.use_id;
//   } catch (error) {
//     return error;
//   }
// });
