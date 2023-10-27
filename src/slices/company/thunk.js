import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
  getCompany as getCompanyApi,
  createOrUpdateCompany as createOrUpdateCompanyApi,
  updateCompany as updateCompanyApi,
} from "../../helpers/backend_helper";


export const getCompany = createAsyncThunk("company/getCompany",  async(soloCompanie=false) => {
  try {

    const response = await getCompanyApi();
    return response;
  } catch (error) {
    return error;
  }
})

export const createOrUpdateCompany = createAsyncThunk("company/createOrUpdateCompany", async (data) => {
  try { 
    
    const response = createOrUpdateCompanyApi(data)
    return response;
  } catch (error) {
    return error;
  }
})


export const updateCompany = createAsyncThunk("company/updateCompany", async (data) => {
  try { 
    
    const response = updateCompanyApi(data)
    return response;
  } catch (error) {
    return error;
  }
})

// export const addNewCompanies = createAsyncThunk("company/addNewCompanies", async (companies) => {
//   try {
//     const response = addNewCompaniesApi(companies)
//     toast.success("Company Added Successfully", { autoClose: 3000 });
//     return response;
//   } catch (error) {
//     toast.error("Company Added Failed", { autoClose: 3000 });
//     return error;
//   }
// })

// export const updateCompanies = createAsyncThunk("crm/updateCompanies", async (companies) => {
//   try {
//     const response = updateCompaniesApi(companies)
//     toast.success("Company Updated Successfully", { autoClose: 3000 });
//     return response;
//   } catch (error) {
//     toast.error("Company Updated Failed", { autoClose: 3000 });
//     return error;
//   }
// })

// export const deleteCompanies = createAsyncThunk("crm/deleteCompanies", async (companies) => {
//   try {
//     const response = deleteCompaniesApi(companies)
//     toast.success("Company Deleted Successfully", { autoClose: 3000 });
//     return { companies, ...response };
//   } catch (error) {
//     toast.error("Company Deleted Failed", { autoClose: 3000 });
//     return error;
//   }
// })
