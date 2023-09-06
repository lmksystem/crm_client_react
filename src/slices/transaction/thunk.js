import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addNewTransaction as addNewTransactionApi,
  getTransaction as getTransactionApi,
  sendInvocieByEmail as sendInvocieByEmailApi
} from "../../helpers/backend_helper";

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