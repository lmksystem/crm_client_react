import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addNewTransaction as addNewTransactionApi,
  getTransaction as getTransactionApi,
  sendInvocieByEmail as sendInvocieByEmailApi,
  deleteTransaction as deleteTransactionApi,
  getTransactionList as getTransactionListApi,
  getTransactionPricePeriode as getTransactionPricePeriodeApi,
  getTransactionByMonth as getTransactionByMonthApi
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const addNewTransaction = createAsyncThunk("invoice/addNewTransaction", async (invoice) => {
  try {
    const response = await addNewTransactionApi(invoice);
    return response;
  }
  catch (error) {
    toast.error("Erreur de creation de la transaction", { autoClose: 3000 });
    return error;
  }
});

export const getTransaction = createAsyncThunk("invoice/getTransaction", async () => {
  try {
    const response = await getTransactionApi();
    return response;
  }
  catch (error) {
    toast.error("Erreur de récupération de transaction", { autoClose: 3000 });
    return error;
  }
});

export const sendInvocieByEmail = createAsyncThunk("invoice/sendInvocieByEmail", async (id) => {
  try {
    const response = await sendInvocieByEmailApi(id);
    return response;
  }
  catch (error) {
    toast.error("Erreur d'envoie de facture", { autoClose: 3000 });
    return error;
  }
});

export const deleteTransaction = createAsyncThunk("invoice/deleteTransaction", async (id) => {
  try {
    const response =await deleteTransactionApi(id);
    return response;
  }
  catch (error) {
    toast.error("Erreur de suppression de transaction", { autoClose: 3000 });
    return error;
  }
});

export const getTransactionList = createAsyncThunk("invoice/getTransactionList", async (id) => {
  try {
    const response = getTransactionListApi(id);
    return response;
  }
  catch (error) {
    toast.error("Echec de récuperation de transaction", { autoClose: 3000 });
    return error;
  }
});

export const getTransactionPricePeriode = createAsyncThunk("transaction/getTransactionPricePeriode", async (data) => {
  try {
    const response =await getTransactionPricePeriodeApi(data);
    return response;
  } 
  catch (error) {
    toast.error("Erreur récupération des transactions par période", { autoClose: 3000 });
    return error;
  }
});

export const getTransactionByMonth = createAsyncThunk("transaction/getTransactionByMonth", async (data) => {
  try {
    const response =await getTransactionByMonthApi(data);
    return response;
  } 
  catch (error) {
    toast.error("Erreur récupération des transactions par période", { autoClose: 3000 });
    return error;
  }
});