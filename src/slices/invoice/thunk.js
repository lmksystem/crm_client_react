import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
  getInvoices as getInvoicesApi,
  addNewInvoice as addNewInvoiceApi,
  updateInvoice as updateInvoiceApi,
  createPdf as createPdfApi,
  getWidgetInvoices as getWidgetInvoicesApi,
  getInvoicePeriodCount as getInvoicePeriodCountApi,
  getInvoiceByMonth as getInvoiceByMonthApi,
} from "../../helpers/backend_helper";

export const getInvoices = createAsyncThunk("invoice/getInvoices", async () => {
  try {
    const response = getInvoicesApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewInvoice = createAsyncThunk("invoice/addNewInvoice", async (invoice) => {
  try {
    const response = addNewInvoiceApi(invoice);
    toast.success("Invoice Added Successfully", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Invoice Added Failed", { autoClose: 3000 });
    return error;
  }
});

export const updateInvoice = createAsyncThunk("invoice/updateInvoice", async (data) => {
  try {
    console.log("update invoice");
    const response = updateInvoiceApi(data.fen_id, data.fen_solde_du);

    return response;
  } catch (error) {
    toast.error("Invoice Updated Failed", { autoClose: 3000 });
    return error;
  }
});

export const createPdf = createAsyncThunk("invoice/createPdf", async (invoice) => {
  try {
    const response = await createPdfApi(invoice);

    return response;
  } catch (error) {
    console.log('erreur', error);
    toast.error("Invoice Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const getWidgetInvoices = createAsyncThunk("invoice/getWidgetInvoices", async (invoice) => {
  try {
    const response = await getWidgetInvoicesApi(invoice);

    return response;
  }
  catch (error) {
    toast.error("Erreur des widgets", { autoClose: 3000 });
    return error;
  }
});

export const getInvoicePeriodCount= createAsyncThunk("invoice/getInvoicePeriodCount", async (data) => {
  try {
    const response = getInvoicePeriodCountApi(data);
    return response;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite sur la récupération des factures", { autoClose: 3000 });
    return error;
  }
});

export const getInvoiceByMonth = createAsyncThunk("invoice/getInvoiceByMonth", async (data) => {
  try {
    const response =await getInvoiceByMonthApi(data);
    return response;
  } 
  catch (error) {
    console.log("thunk catch", error);
    toast.error("Invoice Read Failed", { autoClose: 3000 });
    return error;
  }
});