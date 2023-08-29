import { createSlice } from "@reduxjs/toolkit";
import { getInvoices, addNewInvoice, updateInvoice, deleteInvoice, getInvoiceById, createPdf } from './thunk';
export const initialState = {
  invoices: [],
  invoice: {},
  error: {},
};


const InvoiceSlice = createSlice({
  name: 'InvoiceSlice',
  initialState,
  reducer: {},
  extraReducers: (builder) => {
    builder.addCase(getInvoices.fulfilled, (state, action) => {
      state.invoices = action.payload.data;
      state.isInvoiceCreated = false;
      state.isInvoiceSuccess = true;
    });

    builder.addCase(getInvoices.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isInvoiceCreated = false;
      state.isInvoiceSuccess = false;
    });

    builder.addCase(addNewInvoice.fulfilled, (state, action) => {
      state.invoices.push(action.payload);
      state.isInvoiceCreated = true;
    });

    builder.addCase(addNewInvoice.rejected, (state, action) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(updateInvoice.fulfilled, (state, action) => {
      state.invoices = state.invoices.map(invoice =>
        invoice._id.toString() === action.payload.data._id.toString()
          ? { ...invoice, ...action.payload.data }
          : invoice
      );
    });

    builder.addCase(updateInvoice.rejected, (state, action) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(deleteInvoice.fulfilled, (state, action) => {
      state.invoices = state.invoices.filter(
        invoice => invoice._id.toString() !== action.payload.invoice.toString()
      );
    });

    builder.addCase(deleteInvoice.rejected, (state, action) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getInvoiceById.fulfilled, (state, action) => {

      state.invoice = action.payload.data;
    });

    builder.addCase(getInvoiceById.rejected, (state, action) => {
      state.error = action.payload.data || null;
    });

    builder.addCase(createPdf.fulfilled, (state, action) => {

      state.invoice = { ...state.invoice, ...action.payload.data };
    });

    builder.addCase(createPdf.rejected, (state, action) => {
      state.error = action.payload.data || null;
    });
  }
});

export default InvoiceSlice.reducer;