import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
  getInvoices as getInvoicesApi,
  addNewInvoice as addNewInvoiceApi,
  updateInvoice as updateInvoiceApi,
  createPdf as createPdfApi,
  getWidgetInvoices as getWidgetInvoicesApi
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

export const updateInvoice = createAsyncThunk("invoice/updateInvoice", async (invoice) => {
  try {
    const response = updateInvoiceApi(invoice);
    toast.success("Invoice Updated Successfully", { autoClose: 3000 });
    const data = await response;
    return data;
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