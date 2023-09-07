import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Include Both Helper File with needed methods
import {
  getContacts as getContactsApi,
  addNewContact as addNewContactApi,
  updateContact as updateContactApi,
  deleteContact as deleteContactApi,
  getCollaborateurs as getCollaborateursApi,
  addNewCollaborateur as addNewCollaborateurApi,
  updateCollaborateur as updateCollaborateurApi,
  deleteCollaborateur as deleteCollaborateurApi,
  getTva as getTvaApi,
  addNewTva as addNewTvaApi,
  updateTva as updateTvaApi,
  deleteTva as deleteTvaApi,
  getConstantes as getConstantesApi,
  handleConstantes  as handleConstantesApi,
} from "../../helpers/backend_helper";

// Gestion

// Gestion 

export const getContacts = createAsyncThunk("gestion/getContacts", async () => {
  try {
    const response = getContactsApi()
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewContact = createAsyncThunk("gestion/addNewContact", async (contact) => {
  try {
    const response = await addNewContactApi(contact)

    toast.success("Contact Added Successfully", { autoClose: 3000 });
    return { epe_id: response.data.insertId, ...contact };
  } catch (error) {
    toast.error("Contact Added Failed", { autoClose: 3000 });
    return error;
  }
})

export const updateContact = createAsyncThunk("gestion/updateContact", async (contact) => {
  try {
    const response = await updateContactApi(contact)
    toast.success("Contact Updated Successfully", { autoClose: 3000 });
    return contact;
  } catch (error) {
    toast.error("Contact Updated Failed", { autoClose: 3000 });
    return error;
  }
);

export const deleteContact = createAsyncThunk("gestion/deleteContact", async (contact) => {
  try {
    const response = deleteContactApi(contact)
    toast.success("Contact Deleted Successfully", { autoClose: 3000 });
    return contact;
  } catch (error) {
    toast.error("Contact Deleted Failed", { autoClose: 3000 });
    return error;
  }
);
// Collaborateurs

export const getCollaborateurs = createAsyncThunk("gestion/getCollaborateurs", async () => {
  try {
    const response = getCollaborateursApi()
    return response;
  } catch (error) {
    return error;
  }
);

export const addNewCollaborateur = createAsyncThunk("gestion/addNewCollaborateur", async (collabo) => {
  try {
    const response = await addNewCollaborateurApi(collabo)

    toast.success("Contact Added Successfully", { autoClose: 3000 });
    return response.data;
  } catch (error) {
    toast.error("Contact Added Failed", { autoClose: 3000 });
    return error;
  }
})

export const updateCollaborateur = createAsyncThunk("gestion/updateCollaborateur", async (collabo) => {
  try {
    const response = await updateCollaborateurApi(collabo)
    toast.success("Collaborateur Updated Successfully", { autoClose: 3000 });
    return response.data;
  } catch (error) {
    toast.error("Collaborateur Updated Failed", { autoClose: 3000 });
    return error;
  }
);

export const deleteCollaborateurs = createAsyncThunk("gestion/deleteCollaborateur", async (collabo) => {
  try {
    const response = deleteCollaborateurApi(collabo)
    toast.success("Collaborateur Deleted Successfully", { autoClose: 3000 });
    return collabo;
  } catch (error) {
    toast.error("Collaborateur Deleted Failed", { autoClose: 3000 });
    return error;
  }
);

export const onAddNewClientCompta = createAsyncThunk("gestion/onAddNewClientCompta", async (collabo) => {
  try {
    const response = onAddNewClientCompta(collabo)
    toast.success("Collaborateur Deleted Successfully", { autoClose: 3000 });
    return collabo;
  } catch (error) {
    toast.error("Collaborateur Deleted Failed", { autoClose: 3000 });
    return error;
  }
);


// parametre

export const getTva = createAsyncThunk("gestion/getTva", async () => {
  try {
    const response = getTvaApi()
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewTva = createAsyncThunk("gestion/addNewTva", async (tva) => {
  try {
    console.log(tva);
    const response = await addNewTvaApi(tva)

    toast.success("tva Added Successfully", { autoClose: 3000 });
    return response.data;
  } catch (error) {
    toast.error("tva Added Failed", { autoClose: 3000 });
    return error;
  }
});

export const updateTva = createAsyncThunk("gestion/updateTva", async (tva) => {
  try {
    const response = await updateTvaApi(tva)
    toast.success("tva Updated Successfully", { autoClose: 3000 });
    return response.data;
  } catch (error) {
    toast.error("tva Updated Failed", { autoClose: 3000 });
    return error;
  }
});

export const deleteTva = createAsyncThunk("gestion/deleteTva", async (tva) => {
  try {
    const response = deleteTvaApi(tva)
    toast.success("tva Deleted Successfully", { autoClose: 3000 });
    return tva;
  } catch (error) {
    toast.error("tva Deleted Failed", { autoClose: 3000 });
    return error;
  }
});

//Constantes

export const getConstantes = createAsyncThunk(
  "gestion/getConstantes",
  async () => {
    try {
      const response = getConstantesApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const handleConstantes = createAsyncThunk("gestion/handleConstantes", async (constantes) => {
  try {
    console.log(constantes);
    const response = await handleConstantesApi(constantes);
    return response.data;
  } catch (error) {
    toast.error("tva Added Failed", { autoClose: 3000 });
    return error;
  }
});


