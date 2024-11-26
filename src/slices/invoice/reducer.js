import { createSlice } from "@reduxjs/toolkit";
import { getInvoices, addNewInvoice, updateInvoice, createPdf, getInvoicePeriodCount, getInvoiceByMonth, getEtatInvoice } from "./thunk";
import { sendInvocieByEmail } from "../thunks";
import { toast } from "react-toastify";
export const initialState = {
  invoices: [],
  invoiceEtat: [],
  widgets: [],
  error: {},
  invoiceCountPeriod: {
    dateDebut: null,
    dateFin: null,
    pourcentage_gain_perte: 0
  },
  invoiceByMonth: []
};

const InvoiceSlice = createSlice({
  name: "InvoiceSlice",
  initialState,
  reducers: {
    addTransactionInvoice(state, action) {
      // console.log("add", action.payload);
      state.invoices = state.invoices.map((invoice) => (invoice.header.fen_id == action.payload.tra_fen_fk ? { ...invoice, transaction: [...invoice.transaction, action.payload] } : invoice));
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addNewInvoice.fulfilled, (state, action) => {
      state.invoices.push(action.payload.data);
      state.isInvoiceCreated = true;
    });

    builder.addCase(addNewInvoice.rejected, (state, action) => {
      state.error = action.payload?.data.error || null;
    });

    builder.addCase(updateInvoice.fulfilled, (state, action) => {
      toast.success("Facture mise à jour", { autoClose: 3000 });
      state.invoices = state.invoices.map((i) => (i.header.fen_id == action.payload.data.fen_id ? { ...i, header: { ...i.header, ...action.payload.data } } : i));
    });

    builder.addCase(updateInvoice.rejected, (state, action) => {
      toast.error("Erreur de mise à jour", { autoClose: 3000 });
      state.error = action.payload.error || null;
    });

    builder.addCase(createPdf.fulfilled, (state, action) => {
      state.invoices = state.invoices.map((invoice) => (invoice.header.fen_id == action.payload.data.fdo_fen_fk ? { ...invoice, doc: action.payload.data } : invoice));
    });

    builder.addCase(createPdf.rejected, (state, action) => {
      state.error = action.payload.data || null;
    });

    builder.addCase(sendInvocieByEmail.fulfilled, (state, action) => {
      state.widgets = action.payload.data;
    });

    builder.addCase(sendInvocieByEmail.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getInvoicePeriodCount.fulfilled, (state, action) => {
      state.invoiceCountPeriod = action.payload.data;
    });

    builder.addCase(getInvoicePeriodCount.rejected, (state, action) => {
      state.error = action.payload || null;
    });

    builder.addCase(getInvoiceByMonth.fulfilled, (state, action) => {
      state.invoiceByMonth = action.payload.data;
    });
    builder.addCase(getInvoiceByMonth.rejected, (state, action) => {
      console.log("errors");
      state.error = action.payload || "Erreur lors de la recupération !";
    });

    builder.addCase(getEtatInvoice.fulfilled, (state, action) => {
      state.invoiceEtat = action.payload.data;
    });

    builder.addCase(getEtatInvoice.rejected, (state, action) => {
      state.error = action.payload || "Erreur lors de la recupération des états !";
    });
  }
});

export const { addTransactionInvoice } = InvoiceSlice.actions;

export default InvoiceSlice.reducer;
