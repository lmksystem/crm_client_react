import { createSlice } from "@reduxjs/toolkit";
// import { addNewTransaction, deleteTransaction, getTransaction, getTransactionByMonth, getTransactionList, getTransactionPricePeriode } from "./thunk";
import { toast } from "react-toastify";
import moment from "moment";
import { getTransactionBank } from "./thunk";
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
  },
});

export default transactionBankSlice.reducer;
