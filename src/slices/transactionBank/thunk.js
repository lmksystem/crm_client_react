import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTransactionBank as getTransactionBankApi,
  getTransactionBankAchat as getTransactionBankAchatApi,
  updateJustifyTransactionBank as updateJustifyTransactionBankApi,
  linkTransToAchat as linkTransToAchatApi,
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const getTransactionBank = createAsyncThunk(
  "transactionBank/getTransactionBank",
  async (perdiodeCalendar) => {
    try {
      const response = await getTransactionBankApi(perdiodeCalendar);
      return response;
    } catch (error) {
      toast.error("Transaction Bank Read Failed", { autoClose: 3000 });
      return error;
    }
  }
);

export const getTransactionBankAchat = createAsyncThunk(
  "transactionBank/getTransactionBankAchat",
  async (ach_id) => {
    try {
      const response = getTransactionBankAchatApi(ach_id);
      return response;
    } catch (error) {
      toast.error("Transaction Bank Achat Read Failed", { autoClose: 3000 });
      return error;
    }
  }
);

export const updateJustifyTransactionBank = createAsyncThunk(
  "transactionBank/updateJustifyTransactionBank",
  async (body) => {
    try {
      const response = updateJustifyTransactionBankApi(body);
      return response;
    } catch (error) {
      toast.error("Transaction Bank Achat Update Failed", { autoClose: 3000 });
      return error;
    }
  }
);



