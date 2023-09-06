import { createSlice } from "@reduxjs/toolkit";
import { addNewTransaction, getTransaction } from "./thunk";

export const initialState = {
  transactions: [],
  error: {},
  isTransactionsSuccess: false,
};

const transactionSlice = createSlice({
  name: "Transaction",
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(addNewTransaction.fulfilled, (state, action) => {
      console.log("-----", action.payload);
      state.isTransactionsSuccess = true;

      state.transactions.push(action.payload.data);
    });
    builder.addCase(addNewTransaction.rejected, (state, action) => {
      // state.error = action.payload.msg || "Erreur lors de l'ajout !"
    });
    builder.addCase(getTransaction.fulfilled, (state, action) => {
      console.log(action.payload.data);
      state.transactions = action.payload.data || [];
    });
    builder.addCase(getTransaction.rejected, (state, action) => {
      // state.error = action.payload.msg || "Erreur lors de l'ajout !"
    });
  },
});

export default transactionSlice.reducer;
