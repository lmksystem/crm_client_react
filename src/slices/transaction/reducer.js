import { createSlice } from "@reduxjs/toolkit";
import { addNewTransaction, deleteTransaction, getTransaction, getTransactionByMonth, getTransactionList, getTransactionPricePeriode } from "./thunk";
import { toast } from "react-toastify";
import moment from "moment";
moment.locale('fr')

export const initialState = {
  transactions: [],
  transactionsList: [],
  error: {},
  isTransactionsSuccess: false,
  transactionsPeriodPrice : {
    'dateDebut':null,
    'dateFin':null,
    'pourcentage_gain_perte':0,
  },
  transactionByMonth:[],
};

const transactionSlice = createSlice({
  name: "Transaction",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(addNewTransaction.fulfilled, (state, action) => {
      toast.success('Ajout réussie', { autoClose: 3000 })
      state.isTransactionsSuccess = true;
      state.transactions.push(action.payload.data);
    });
    builder.addCase(addNewTransaction.rejected, (state, action) => {
      toast.error('Erreur d\'ajout !', { autoClose: 3000 })
      state.isTransactionsSuccess = false;
      state.error = action.payload || "Erreur lors de l'ajout !"
    });
    builder.addCase(getTransaction.fulfilled, (state, action) => {

      state.isTransactionsSuccess = true;
      state.transactions = action.payload.data || [];
    });
    builder.addCase(getTransaction.rejected, (state, action) => {
      state.isTransactionsSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      toast.success('Transaction supprimer', { autoClose: 3000 })
      state.isTransactionsSuccess = true;
      state.transactions = state.transactions.filter((t) => t.tra_id != action.payload.data)
    })
    builder.addCase(deleteTransaction.rejected, (state, action) => {
      toast.error('Erreur de suppression !', { autoClose: 3000 })
      state.isTransactionsSuccess = false;
      state.error = action.payload || "Erreur de suppression !"
    });
    builder.addCase(getTransactionList.fulfilled, (state, action) => {
      state.isTransactionsListSuccess = true;
      state.transactionsList = action.payload.data
    })
    builder.addCase(getTransactionList.rejected, (state, action) => {
      state.isTransactionsListSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });
    builder.addCase(getTransactionPricePeriode.fulfilled, (state, action) => {
      state.isTransactionsSuccess = true;
      state.transactionsPeriodPrice = action.payload.data
    });
    builder.addCase(getTransactionPricePeriode.rejected, (state, action) => {
      state.isTransactionsSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });
    builder.addCase(getTransactionByMonth.fulfilled, (state, action) => {
      state.isTransactionsSuccess = true;
      state.transactionByMonth = action.payload.data
    });
    builder.addCase(getTransactionByMonth.rejected, (state, action) => {
      state.isTransactionsSuccess = false;
      state.error = action.payload || "Erreur lors de la recupération !"
    });

  }
});

export default transactionSlice.reducer;
