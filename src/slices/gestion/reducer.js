import { createSlice } from "@reduxjs/toolkit";
import {
  getContacts,
  addNewContact,
  updateContact,
  deleteContact,
  getCollaborateurs,
  addNewCollaborateur,
  updateCollaborateur,
  deleteCollaborateurs,
  getTva,
  updateTva,
  deleteTva,
  addNewTva,
  getConstantes,
  handleConstantes,
  getEntityPeriodCount,
} from "./thunk";
import { getInvoicePeriodCount } from "../thunks";

export const initialState = {
  contacts: [],
  collaborateurs: [],
  tva: null,
  constantes: null,
  error: {},
  entityCountPeriod:{
    'dateDebut':null,
    'dateFin':null,
    'pourcentage_gain_perte':0,
  },
};

const gestionSlice = createSlice({
  name: "gestion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // GESTION
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.contacts = action.payload?.data;
      state.isContactCreated = false;
      state.isContactSuccess = true;
    });

    builder.addCase(getContacts.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isContactCreated = false;
      state.isContactSuccess = false;
    });

    builder.addCase(addNewContact.fulfilled, (state, action) => {
      state.contacts.push(action.payload);
      state.isContactCreated = true;
      state.isContactAdd = true;
      state.isContactAddFail = false;
    });

    builder.addCase(addNewContact.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isContactAdd = false;
      state.isContactAddFail = true;
    });

    builder.addCase(updateContact.fulfilled, (state, action) => {
      state.contacts = state.contacts.map((contact) =>
        contact.epe_id == action.payload.epe_id
          ? { ...contact, ...action.payload }
          : contact
      );
      state.isContactCreated = true;
      state.isContactAdd = true;
      state.isContactAddFail = false;
    });

    builder.addCase(updateContact.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isContactUpdate = false;
      state.isContactUpdateFail = true;
    });

    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contacts = (state.contacts || []).filter(
        (contact) => contact.epe_id != action.payload
      );
      state.isContactDelete = true;
      state.isContactDeleteFail = false;
    });

    builder.addCase(deleteContact.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isContactDelete = false;
      state.isContactDeleteFail = true;
    });

    // COLLABORATEUR
    builder.addCase(getCollaborateurs.fulfilled, (state, action) => {
      state.collaborateurs = action.payload?.data;
      state.isCollaborateurCreated = false;
      state.isCollaborateurSuccess = true;
    });

    builder.addCase(getCollaborateurs.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isCollaborateurCreated = false;
      state.isCollaborateurSuccess = false;
    });

    builder.addCase(addNewCollaborateur.fulfilled, (state, action) => {
      state.collaborateurs.push(action.payload);
      state.isCollaborateurCreated = true;
      state.isCollaborateurAdd = true;
      state.isCollaborateurAddFail = false;
    });

    builder.addCase(addNewCollaborateur.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isCollaborateurAdd = false;
      state.isCollaborateurAddFail = true;
    });

    builder.addCase(updateCollaborateur.fulfilled, (state, action) => {
      // console.log("paylaod", action.payload);
      state.collaborateurs = state.collaborateurs.map((collaborateur) =>
        collaborateur.ent_id == action.payload.ent_id
          ? action.payload
          : collaborateur
      );
      state.isCollaborateurCreated = true;
      state.isCollaborateurAdd = true;
      state.isCollaborateurAddFail = false;
    });

    builder.addCase(updateCollaborateur.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isCollaborateurUpdate = false;
      state.isCollaborateurUpdateFail = true;
    });

    builder.addCase(deleteCollaborateurs.fulfilled, (state, action) => {
      state.collaborateurs = (state.collaborateurs || []).filter(
        (collab) => collab.ent_id != action.payload
      );
      state.isCollaborateurDelete = true;
      state.isCollaborateurDeleteFail = false;
    });

    builder.addCase(deleteCollaborateurs.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isTvaDelete = false;
      state.isTvaDeleteFail = true;
    });

    // TVA

    builder.addCase(getTva.fulfilled, (state, action) => {
      state.tva = action.payload?.data;
      state.isTvaCreated = false;
      state.isTvaSuccess = true;
    });

    builder.addCase(getTva.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isTvaCreated = false;
      state.isTvaSuccess = false;
    });

    builder.addCase(addNewTva.fulfilled, (state, action) => {
      state.tva.push(action.payload);
      state.isTvaCreated = true;
      state.isTvaAdd = true;
      state.isTvaAddFail = false;
    });

    builder.addCase(addNewTva.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isTvaAdd = false;
      state.isTvaAddFail = true;
    });

    builder.addCase(updateTva.fulfilled, (state, action) => {
      state.tva = state.tva.map((t) =>
        t.tva_id == action.payload.tva_id ? action.payload : t
      );
      state.isCollaborateurCreated = true;
      state.isTvaAdd = true;
      state.isTvaAddFail = false;
    });

    builder.addCase(updateTva.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isTvaUpdate = false;
      state.isTvaUpdateFail = true;
    });

    builder.addCase(deleteTva.fulfilled, (state, action) => {
      state.tva = (state.tva || []).filter((t) => t.tva_id != action.payload);
      state.isTvaDelete = true;
      state.isTvaDeleteFail = false;
    });

    builder.addCase(deleteTva.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isTvaDelete = false;
      state.isTvaDeleteFail = true;
    });

    // Constantes

    builder.addCase(getConstantes.fulfilled, (state, action) => {
      state.constantes = action.payload?.data;
      state.isTvaCreated = false;
      state.isTvaSuccess = true;
    });

    builder.addCase(getConstantes.rejected, (state, action) => {
      state.error = action.payload?.data || null;
      state.isTvaCreated = false;
      state.isTvaSuccess = false;
    });

    builder.addCase(handleConstantes.fulfilled, (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        const newConst = action.payload[i];
        let index = state.constantes.findIndex(
          (c) => c.con_id == newConst.con_id
        );
        if (index != -1) {
          state.constantes[index] = newConst;
        } else {
          state.constantes.push(newConst);
        }
      }
     
    });

    builder.addCase(handleConstantes.rejected, (state, action) => {
      state.error = action.payload?.data || null;
    });

    builder.addCase(getEntityPeriodCount.fulfilled, (state, action) => {
      state.entityCountPeriod = action.payload.data;
    });

    builder.addCase(getInvoicePeriodCount.rejected, (state, action) => {
      state.error = action.payload || null;
    });


    // builder.addCase(updateTva.fulfilled, (state, action) => {

    //   state.tva = state.tva.map(t =>
    //     t.tva_id == action.payload.tva_id
    //       ? action.payload
    //       : t
    //   );
    //   state.isCollaborateurCreated = true;
    //   state.isTvaAdd = true;
    //   state.isTvaAddFail = false;
    // });

    // builder.addCase(updateTva.rejected, (state, action) => {
    //   state.error = action.payload?.data || null;
    //   state.isTvaUpdate = false;
    //   state.isTvaUpdateFail = true;
    // });
  },
});

export default gestionSlice.reducer;
