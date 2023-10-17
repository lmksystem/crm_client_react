import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getListBank as getListBankApi,
  getAccountsBankUser as getAccountsBankUserApi,
  insertBankAccount as insertBankAccountApi
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


export const getAccountsBankUser = createAsyncThunk(
    "bankAccount/getAccountsBankUser",
    async () => {
      try {
        const response = await getAccountsBankUserApi();
        return response;
      } catch (error) {
        toast.error("List Bank And Account User Read Failed", { autoClose: 3000 });
        return error;
      }
    }
  );


export const insertBankAccount = createAsyncThunk(
  "bankAccount/insertBankAccount",
  async (body) => {
    try {
      const response =await insertBankAccountApi(body);
      if(response.data.link){
        window.location.replace(response.data.link);
      }
      return response;
    } catch (error) {
      toast.error("Bank Account Post Failed", { autoClose: 3000 });
      return error;
    }
  }
);



