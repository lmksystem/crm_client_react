import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import moment from "moment";
import { getAccountBank, getListBank, insertAccountLinkToBank, insertBankAccount } from "./thunk";
moment.locale("fr");

export const initialState = {
  listBank :[],
  listAccountsBank:[],
  error: {},
  isBankAccountSuccess: false,
};

const bankAccountSlice = createSlice({
  name: "BankAccount",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getListBank.fulfilled, (state, action) => {
      state.isBankAccountSuccess = true;
      state.listBank = action.payload.data;
    });
    builder.addCase(getListBank.rejected, (state, action) => {
      state.isBankAccountSuccess = false;
      state.listBank=[];
      state.error = action.payload || "Erreur lors de la recupération !";
    });
    builder.addCase(insertBankAccount.fulfilled, (state, action) => {
      state.isBankAccountSuccess = true;
    });
    builder.addCase(insertBankAccount.rejected, (state, action) => {
      state.isBankAccountSuccess = false;
    });
    builder.addCase(getAccountBank.fulfilled, (state, action) => {
      state.isBankAccountSuccess = true;
      state.listAccountsBank = action.payload.data;
    });
    builder.addCase(getAccountBank.rejected, (state, action) => {
      state.isBankAccountSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });
    builder.addCase(insertAccountLinkToBank.fulfilled, (state, action) => {
      state.isBankAccountSuccess = true;
      state.listAccountsBank = state.listAccountsBank.map((acc) =>
      acc.bua_account_id == action.payload.data.bua_account_id
      ? { ...acc, bua_libelle : action.payload.data.bua_libelle }
      : acc)
    });
    builder.addCase(insertAccountLinkToBank.rejected, (state, action) => {
      state.isBankAccountSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });
  },
});

export default bankAccountSlice.reducer;
