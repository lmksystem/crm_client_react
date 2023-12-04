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
  getEtatInvoice as getEtatInvoiceApi
} from "../../helpers/backend_helper";

export const getInvoices = createAsyncThunk("invoice/getInvoices", async () => {
  try {
    const response = getInvoicesApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewInvoice = createAsyncThunk("invoice/addNewInvoice", async (data) => {
  try {
    const response = await addNewInvoiceApi(data)
    
    toast.success("Ajout de facture réussi", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Erreur d'ajout facture", { autoClose: 3000 });
    return error;
  }
});

export const updateInvoice = createAsyncThunk("invoice/updateInvoice", async (data) => {
  try {

    const response = updateInvoiceApi(data.fen_id, data);

    return response;
  } catch (error) {
    toast.error("Erreur mise à jour de facture", { autoClose: 3000 });
    return error;
  }
});

export const createPdf = createAsyncThunk("invoice/createPdf", async (invoice) => {
  try {
    const response = createPdfApi(invoice);
    return response;
  } catch (error) {
    toast.error("Création du pdf echoué", { autoClose: 3000 });
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

export const getInvoicePeriodCount = createAsyncThunk("invoice/getInvoicePeriodCount", async (data) => {
  try {
    const response = getInvoicePeriodCountApi(data);
    return response;
  } catch (error) {
    toast.error("Une erreur s'est produite sur la récupération des factures", { autoClose: 3000 });
    return error;
  }
});

export const getInvoiceByMonth = createAsyncThunk("invoice/getInvoiceByMonth", async (data) => {
  try {
    const response = await getInvoiceByMonthApi(data);
    return response;
  }
  catch (error) {
    toast.error("Erreur lecture des factures", { autoClose: 3000 });
    return error;
  }
});

export const getEtatInvoice = createAsyncThunk("invoice/getEtatInvoice", async () => {
  try {
    const response = await getEtatInvoiceApi();
    return response;
  }
  catch (error) {
    toast.error("Erreur de lecture d'état de facture", { autoClose: 3000 });
    return error;
  }
});