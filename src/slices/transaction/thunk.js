import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addNewTransaction as addNewTransactionApi,
  getTransaction as getTransactionApi,
  sendInvocieByEmail as sendInvocieByEmailApi,
  deleteTransaction as deleteTransactionApi,
  getTransactionList as getTransactionListApi,
  getTransactionPricePeriode as getTransactionPricePeriodeApi
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const addNewTransaction = createAsyncThunk("invoice/addNewTransaction", async (invoice) => {
  try {
    const response = await addNewTransactionApi(invoice);
    return response;
  }
  catch (error) {
    toast.error("Invoice Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const getTransaction = createAsyncThunk("invoice/getTransaction", async () => {
  try {
    const response = await getTransactionApi();
    return response;
  }
  catch (error) {
    toast.error("Invoice Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const sendInvocieByEmail = createAsyncThunk("invoice/sendInvocieByEmail", async (id) => {
  try {
    const response = await sendInvocieByEmailApi(id);
    return response;
  }
  catch (error) {
    toast.error("Invoice Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const deleteTransaction = createAsyncThunk("invoice/deleteTransaction", async (id) => {
  try {
    const response = deleteTransactionApi(id);
    return response;
  }
  catch (error) {
    toast.error("Invoice Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const getTransactionList = createAsyncThunk("invoice/getTransactionList", async (id) => {
  try {
    const response = getTransactionListApi(id);
    return response;
  }
  catch (error) {
    toast.error("Invoice Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const getTransactionPricePeriode = createAsyncThunk("transaction/getTransactionPricePeriode", async (data) => {
  try {
    const response = getTransactionPricePeriodeApi(data);
    return response;
  } 
  catch (error) {
    toast.error("Transaction Read Failed", { autoClose: 3000 });
    return error;
  }
});