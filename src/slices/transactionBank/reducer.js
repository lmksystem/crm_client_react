import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import moment from "moment";
import { getTransactionBank, getTransactionBankAchat, updateJustifyTransactionBank } from "./thunk";
moment.locale("fr");

export const initialState = {
  transactionsBank: [],
  error: {},
  isTransactionBankSuccess: false,
};

const transactionBankSlice = createSlice({
  name: "TransactionBank",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getTransactionBank.fulfilled, (state, action) => {
      state.isTransactionBankSuccess = true;
      state.transactionsBank = action.payload.data;
    });
    builder.addCase(getTransactionBank.rejected, (state, action) => {
      state.isTransactionBankSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });
    builder.addCase(getTransactionBankAchat.fulfilled, (state, action) => {
      state.isTransactionBankSuccess = true;
      state.transactionsBank = action.payload.data;
    });
    builder.addCase(getTransactionBankAchat.rejected, (state, action) => {
      state.isTransactionBankSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });
    builder.addCase(updateJustifyTransactionBank.fulfilled, (state, action) => {
      state.isTransactionBankSuccess = true;
      state.transactionsBank = state.transactionsBank.map((tba) =>
      tba.tba_id == action.payload.data.tba_id
      ? { ...tba, tba_justify: action.payload.data.tba_justify }
      : tba
    );
      // state.transactionsBank = action.payload.data;
    });
    builder.addCase(updateJustifyTransactionBank.rejected, (state, action) => {
      state.isTransactionBankSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !";
    });

    
   
  },
});

export default transactionBankSlice.reducer;
