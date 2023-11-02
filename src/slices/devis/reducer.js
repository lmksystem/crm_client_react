import { createSlice, current } from "@reduxjs/toolkit";
import { getDevis, addNewDevis, updateDevis, deleteDevis, getDevisById, createPdfDevis, getDevisForEdit, getEtatDevis, getDevisPeriodCount, getDevisByMonth } from './thunk';
import { getDevisWidgets } from "../../slices/thunks";
export const initialState = {
  devisList: [],
  widgets: [],
  error: {},
  etatDevis: [],
  devisCountPeriod: {
    'dateDebut': null,
    'dateFin': null,
    'pourcentage_gain_perte': 0,
  },
  devisByMonth: [],
};


const devisSlice = createSlice({
  name: 'devisSlice',
  initialState,
  reducer: {
    updateList(state, action) {
      state.devisList = state.devisList.map(devis =>
        devis.header.den_id == action.payload.data.ddo_den_id
          ? { devis, doc: action.payload.data }
          : devis
      );
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDevis.fulfilled, (state, action) => {
      state.devisList = action.payload.data;
      state.isDevisCreated = false;
      state.isDevisSuccess = true;
    });

    builder.addCase(getDevis.rejected, (state, action) => {
      state.error = state.msg || null;
      state.isDevisCreated = false;
      state.isDevisSuccess = false;
    });

    builder.addCase(addNewDevis.fulfilled, (state, action) => {

      let index = state.devisList.findIndex(d => d.header.den_id == action.payload.data.header.den_id);

      if (index != -1) {
        state.devisList[index] = action.payload.data;
        state.isDevisCreated = true;
      } else {
        action.payload.data.doc = null;
        state.devisList.push(action.payload.data);
        state.isDevisCreated = true;
      }

    });

    builder.addCase(addNewDevis.rejected, (state, action) => {
      state.error = action.payload.msg || null;
    });

    builder.addCase(deleteDevis.fulfilled, (state, action) => {
      state.devisList = state.devisList.filter(
        devis => devis.header.den_id.toString() !== action.payload.toString()
      );
    });

    builder.addCase(deleteDevis.rejected, (state, action) => {
      state.error = action.payload.msg || null;
    });

    builder.addCase(createPdfDevis.fulfilled, (state, action) => {
      state.devisList = state.devisList.map(devis =>
        devis.header.den_id == action.payload.data.ddo_den_fk
          ? { ...devis, doc: action.payload.data }
          : devis
      );
    });

    builder.addCase(createPdfDevis.rejected, (state, action) => {
      console.log("errors");
      state.error = action.payload || null;
    });

    builder.addCase(getDevisWidgets.fulfilled, (state, action) => {
      state.widgets = action.payload.data;
    });

    builder.addCase(getDevisWidgets.rejected, (state, action) => {
      state.error = action.payload || null;
    });

    builder.addCase(getEtatDevis.fulfilled, (state, action) => {
      state.etatDevis = action.payload.data;
    });

    builder.addCase(getEtatDevis.rejected, (state, action) => {
      console.log("errors");
      state.error = action.payload || null;
    });
    builder.addCase(getDevisPeriodCount.fulfilled, (state, action) => {
      state.devisCountPeriod = action.payload.data;
    });

    builder.addCase(getDevisPeriodCount.rejected, (state, action) => {
      console.log("errors");
      state.error = action.payload || null;
    });

    builder.addCase(getDevisByMonth.fulfilled, (state, action) => {
      state.devisByMonth = action.payload.data
    });
    builder.addCase(getDevisByMonth.rejected, (state, action) => {
      console.log("errors");
      state.error = action.payload || "Erreur lors de la recupération !"
    });

    builder.addCase(updateDevis.fulfilled, (state, action) => {
      console.log(action.payload.data);
      state.devisList = state.devisList.map((d) => (d.header.den_id == action.payload.data.den_id ? { ...d, header: action.payload.data } : d))
    });
    builder.addCase(updateDevis.rejected, (state, action) => {
      console.log("errors");
      state.error = action.payload || "Erreur lors de la recupération !"
    });
  }
});

export const { updateList } = devisSlice.actions

export default devisSlice.reducer;