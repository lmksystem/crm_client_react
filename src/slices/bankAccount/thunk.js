import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getListBank as getListBankApi,
  getAccountsBankUser as getAccountsBankUserApi,
  insertBankAccount as insertBankAccountApi,
  getAccountBank as getAccountBankApi,
  insertAccountLinkToBank as insertAccountLinkToBankApi
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const getListBank = createAsyncThunk(
  "bankAccount/getListBank",
  async () => {
    try {
      const response = await getListBankApi();
      return response;
    } catch (error) {
      toast.error("List Bank Read Failed", { autoClose: 3000 });
      return error;
    }
  }
);

export const getAccountBank = createAsyncThunk(
  "bankAccount/getAccountBank",
  async () => {
    try {
      const response = await getAccountBankApi();
      return response;
    } catch (error) {
      console.log(error)
      toast.error("List Account Bank User Read Failed", { autoClose: 3000 });
      return error;
    }
  }
);

export const getAccountsBankUser = createAsyncThunk(
  "bankAccount/getAccountsBankUser",
  async () => {
    try {
      const response = await getAccountsBankUserApi();
      return response;
    } catch (error) {
      toast.error("List Bank And Account User Read Failed", {
        autoClose: 3000,
      });
      return error;
    }
  }
);

export const insertBankAccount = createAsyncThunk(
  "bankAccount/insertBankAccount",
  async (body) => {
    try {
      const response = await insertBankAccountApi(body);
      if (response.data.link) {
        window.location.replace(response.data.link);
      }
      return response;
    } catch (error) {
      toast.error("Bank Account Post Failed", { autoClose: 3000 });
      return error;
    }
  }
);


export const insertAccountLinkToBank= createAsyncThunk(
  "bankAccount/insertAccountLinkToBank",
  async (body) => {
    try {
      const response = await insertAccountLinkToBankApi(body);
      toast.success("Libellé mis à jour", { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error("Bank Account Post Failed", { autoClose: 3000 });
      return error;
    }
  }
);
