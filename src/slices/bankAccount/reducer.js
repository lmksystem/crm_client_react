import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import moment from "moment";
import { getAccountBank, getListBank, insertBankAccount } from "./thunk";
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
      state.error = action.payload || "Erreur lors de la recupération !";
    });
    builder.addCase(insertBankAccount.fulfilled, (state, action) => {
      state.isBankAccountSuccess = true;
    });
    builder.addCase(getAccountBank.fulfilled, (state, action) => {
      state.isBankAccountSuccess = true;
      state.listAccountsBank = action.payload.data;
    });
    builder.addCase(getAccountBank.rejected, (state, action) => {
      state.isBankAccountSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });
  },
});

export default bankAccountSlice.reducer;
