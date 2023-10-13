import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import moment from "moment";
import { getListBank, insertBankAccount } from "./thunk";
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
//     builder.addCase(getTransactionBankAchat.fulfilled, (state, action) => {
//       state.isTransactionBankSuccess = true;
//       state.transactionsBank = action.payload.data;
//     });
//     builder.addCase(getTransactionBankAchat.rejected, (state, action) => {
//       state.isTransactionBankSuccess = false;
//       state.error = action.payload || "Erreur lors de la recupération !";
//     });
    builder.addCase(insertBankAccount.fulfilled, (state, action) => {
      state.isBankAccountSuccess = true;
    //   state.transactionsBank = state.transactionsBank.map((tba) =>
    //   tba.tba_id == action.payload.data.tba_id
    //   ? { ...tba, tba_justify: action.payload.data.tba_justify }
    //   : tba
    // );
    });
    builder.addCase(insertBankAccount.rejected, (state, action) => {
      state.isBankAccountSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });
  },
});

export default bankAccountSlice.reducer;
