import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
  getCompanies as getCompaniesApi,
  getDeals as getDealsApi,
  getLeads as getLeadsApi,
  addNewCompanies as addNewCompaniesApi,
  updateCompanies as updateCompaniesApi,
  deleteCompanies as deleteCompaniesApi,
  addNewLead as addNewLeadApi,
  updateLead as updateLeadApi,
  deleteLead as deleteLeadApi
} from "../../helpers/fakebackend_helper";



export const getCompanies = createAsyncThunk("crm/getCompanies", async () => {
  try {
    const response = getCompaniesApi()
    return response;
  } catch (error) {
    return error;
  }
})

export const addNewCompanies = createAsyncThunk("crm/addNewCompanies", async (companies) => {
  try {
    const response = addNewCompaniesApi(companies)
    toast.success("Company Added Successfully", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Company Added Failed", { autoClose: 3000 });
    return error;
  }
})

export const updateCompanies = createAsyncThunk("crm/updateCompanies", async (companies) => {
  try {
    const response = updateCompaniesApi(companies)
    toast.success("Company Updated Successfully", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Company Updated Failed", { autoClose: 3000 });
    return error;
  }
})

export const deleteCompanies = createAsyncThunk("crm/deleteCompanies", async (companies) => {
  try {
    const response = deleteCompaniesApi(companies)
    toast.success("Company Deleted Successfully", { autoClose: 3000 });
    return { companies, ...response };
  } catch (error) {
    toast.error("Company Deleted Failed", { autoClose: 3000 });
    return error;
  }
})

export const getLeads = createAsyncThunk("crm/getLeads", async () => {
  try {
    const response = getLeadsApi()
    return response;
  } catch (error) {
    return error;
  }
})

export const addNewLead = createAsyncThunk("crm/addNewLead", async (lead) => {
  try {
    const response = addNewLeadApi(lead)
    toast.success("Lead Added Successfully", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Lead Added Failed", { autoClose: 3000 });
    return error;
  }
})

export const updateLead = createAsyncThunk("crm/updateLead", async (lead) => {
  try {
    const response = updateLeadApi(lead)
    toast.success("Lead Updated Successfully", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Lead Updated Failed", { autoClose: 3000 });
    return error;
  }
})

export const deleteLead = createAsyncThunk("crm/deleteLead", async (leads) => {
  try {
    const response = deleteLeadApi(leads)
    toast.success("Lead Deleted Successfully", { autoClose: 3000 });
    return { leads, ...response };

  } catch (error) {
    toast.error("Lead Deleted Failed", { autoClose: 3000 });
    return error;
  }
})

export const getDeals = createAsyncThunk("crm/getDeals", async () => {
  try {
    const response = getDealsApi()
    return response;
  } catch (error) {
    return error;
  }
})