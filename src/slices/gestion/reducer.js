import { createSlice } from "@reduxjs/toolkit";
import { getContacts, addNewContact, updateContact, deleteContact, getCollaborateurs, addNewCollaborateur, updateCollaborateur, deleteCollaborateurs } from './thunk';

export const initialState = {
  contacts: [],
  collaborateurs: [],
  error: {}
};

const gestionSlice = createSlice({
  name: "gestion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // GESTION
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.contacts = action.payload.data;
      state.isContactCreated = false;
      state.isContactSuccess = true;
    });

    builder.addCase(getContacts.rejected, (state, action) => {
      state.error = action.payload.error || null;
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
      state.error = action.payload.error || null;
      state.isContactAdd = false;
      state.isContactAddFail = true;
    });

    builder.addCase(updateContact.fulfilled, (state, action) => {
      state.contacts = state.contacts.map(contact =>
        contact.epe_id == action.payload.epe_id
          ? { ...contact, ...action.payload }
          : contact
      );
      state.isContactCreated = true;
      state.isContactAdd = true;
      state.isContactAddFail = false;
    });

    builder.addCase(updateContact.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isContactUpdate = false;
      state.isContactUpdateFail = true;
    });

    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contacts = (state.contacts || []).filter((contact) => contact.epe_id != action.payload);
      state.isContactDelete = true;
      state.isContactDeleteFail = false;
    });

    builder.addCase(deleteContact.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isContactDelete = false;
      state.isContactDeleteFail = true;
    });

    // COLLABORATEUR
    builder.addCase(getCollaborateurs.fulfilled, (state, action) => {
      state.collaborateurs = action.payload.data;
      state.isCollaborateurCreated = false;
      state.isCollaborateurSuccess = true;
    });

    builder.addCase(getCollaborateurs.rejected, (state, action) => {
      state.error = action.payload.error || null;
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
      state.error = action.payload.error || null;
      state.isContactAdd = false;
      state.isContactAddFail = true;
    });

    builder.addCase(updateCollaborateur.fulfilled, (state, action) => {
   
      state.collaborateurs = state.collaborateurs.map(collaborateur =>
        collaborateur.ent_id == action.payload.ent_id
          ? action.payload
          : collaborateur
      );
      state.isCollaborateurCreated = true;
      state.isCollaborateurAdd = true;
      state.isCollaborateurAddFail = false;
    });

    builder.addCase(updateCollaborateur.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isCollaborateurUpdate = false;
      state.isCollaborateurUpdateFail = true;
    });

    builder.addCase(deleteCollaborateurs.fulfilled, (state, action) => {
      state.collaborateurs = (state.contacts || []).filter((contact) => contact.ent_id != action.payload);
      state.isCollaborateurDelete = true;
      state.isCollaborateurDeleteFail = false;
    });

    builder.addCase(deleteCollaborateurs.rejected, (state, action) => {
      state.error = action.payload.error || null;
      state.isCollaborateurDelete = false;
      state.isCollaborateurDeleteFail = true;
    });

  },
});

export default gestionSlice.reducer;