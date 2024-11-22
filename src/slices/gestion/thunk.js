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
  handleConstantes as handleConstantesApi,
  getEntityPeriodCount as getEntityPeriodCountApi,
  handleAlert as handleAlertApi,
  getAlert as getAlertApi,
  deleteAlert as deleteAlertApi
} from "../../helpers/backend_helper";
import { getInvoices } from "../../services/invoice";

// Gestion

export const getContacts = createAsyncThunk("gestion/getContacts", async () => {
  try {
    const response = getContactsApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewContact = createAsyncThunk("gestion/addNewContact", async (contact) => {
  try {
    const response = await addNewContactApi(contact);

    toast.success("Contact ajouté", { autoClose: 3000 });
    return { epe_id: response.data.insertId, ...contact };
  } catch (error) {
    toast.error("Erreur ajout contact", { autoClose: 3000 });
    return error;
  }
});

export const updateContact = createAsyncThunk("gestion/updateContact", async (contact) => {
  try {
    const response = await updateContactApi(contact);
    toast.success("Contact mis à jour", { autoClose: 3000 });
    return contact;
  } catch (error) {
    toast.error("Erreur mise à jour de contact", { autoClose: 3000 });
    return error;
  }
});

export const deleteContact = createAsyncThunk("gestion/deleteContact", async (contact) => {
  try {
    const response = deleteContactApi(contact);
    toast.success("Contact suppirmé", { autoClose: 3000 });
    return contact;
  } catch (error) {
    toast.error("Erreur suppression de contact", { autoClose: 3000 });
    return error;
  }
});
// Collaborateurs

export const getCollaborateurs = createAsyncThunk("gestion/getCollaborateurs", async () => {
  try {
    const response = getCollaborateursApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const getDetailsCollabo = createAsyncThunk("gestion/getDetailsCollabo", async (item) => {
  try {
    let response = {};
    response.infoBase = item;
    const InvoicesCollabo = await getInvoices({
      dateDebut: null,
      dateFin: null
    });
    let InvoicesByCollabo = InvoicesCollabo?.data?.filter((inv) => inv.header.fen_ent_fk == item.ent_id) || [];
    response.invoices = InvoicesByCollabo;
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewCollaborateur = createAsyncThunk("gestion/addNewCollaborateur", async (collabo) => {
  try {
    const response = await addNewCollaborateurApi(collabo);
    toast.success("Nouveau client/fournisseur ajouté", { autoClose: 3000 });
    return response.data;
  } catch (error) {
    toast.error("Erreur d'ajout de contact", { autoClose: 3000 });
    return error;
  }
});

export const updateCollaborateur = createAsyncThunk("gestion/updateCollaborateur", async (collabo) => {
  try {
    const response = await updateCollaborateurApi(collabo);
    toast.success("Client/fournisseur mis à jour", { autoClose: 3000 });
    return response.data;
  } catch (error) {
    toast.error("Erreur mise à jour", { autoClose: 3000 });
    return error;
  }
});

export const deleteCollaborateurs = createAsyncThunk("gestion/deleteCollaborateur", async (collabo) => {
  try {
    const response = deleteCollaborateurApi(collabo);
    toast.success("Client/fournisseur supprimé", { autoClose: 3000 });
    return collabo;
  } catch (error) {
    toast.error("Erreur suppression client/fournisseur", { autoClose: 3000 });
    return error;
  }
});

export const onAddNewClientCompta = createAsyncThunk("gestion/onAddNewClientCompta", async (collabo) => {
  try {
    const response = onAddNewClientCompta(collabo);
    toast.success("Ajout du type client/fournisseur ", { autoClose: 3000 });
    return collabo;
  } catch (error) {
    toast.error("Erreur ajout du type client/fournisseur", {
      autoClose: 3000
    });
    return error;
  }
});

// parametre

export const getTva = createAsyncThunk("gestion/getTva", async () => {
  try {
    const response = getTvaApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewTva = createAsyncThunk("gestion/addNewTva", async (tva) => {
  try {
    const response = await addNewTvaApi(tva);
    toast.success("TVA bien ajouté", { autoClose: 3000 });
    return response.data;
  } catch (error) {
    toast.error("Erreur ajout TVA", { autoClose: 3000 });
    return error;
  }
});

export const updateTva = createAsyncThunk("gestion/updateTva", async (tva) => {
  try {
    const response = await updateTvaApi(tva);
    toast.success("TVA bien msie à jour", { autoClose: 3000 });
    return response.data;
  } catch (error) {
    toast.error("Erreur mise à jour de TVA", { autoClose: 3000 });
    return error;
  }
});

export const deleteTva = createAsyncThunk("gestion/deleteTva", async (tva) => {
  try {
    const response = deleteTvaApi(tva);
    toast.success("TVA supprimée", { autoClose: 3000 });
    return tva;
  } catch (error) {
    toast.error("Erreur suppression TVA", { autoClose: 3000 });
    return error;
  }
});

//Constantes

export const getConstantes = createAsyncThunk("gestion/getConstantes", async () => {
  try {
    const response = await getConstantesApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const handleConstantes = createAsyncThunk("gestion/handleConstantes", async (constantes) => {
  try {
    let arrayResponse = [];
    for (let index = 0; index < constantes.length; index++) {
      const newConst = constantes[index];
      let reponse = await handleConstantesApi(newConst);
      arrayResponse.push(reponse.data);
    }
    toast.success("Enregistrer !", { autoClose: 3000 });
    return arrayResponse;
  } catch (error) {
    toast.error("Echec !", { autoClose: 3000 });
    return error;
  }
});

export const getEntityPeriodCount = createAsyncThunk("gestion/getEntityPeriodCount", async (data) => {
  try {
    const response = await getEntityPeriodCountApi(data);
    return response;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite sur la récupération des fournisseurs", { autoClose: 3000 });
    return error;
  }
});

export const handleAlert = createAsyncThunk("gestion/handleAlert", async (data) => {
  try {
    const response = await handleAlertApi(data);
    toast.success("Enregistrer !", { autoClose: 3000 });
    return response;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite à la création du rappel", {
      autoClose: 3000
    });
    return error;
  }
});

export const getAlert = createAsyncThunk("gestion/getAlert", async () => {
  try {
    const response = await getAlertApi();

    return response;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite lors de la récupération des rappels", { autoClose: 3000 });
    return error;
  }
});

export const deleteAlert = createAsyncThunk("gestion/deleteAlert", async (id) => {
  try {
    const response = await deleteAlertApi(id);
    toast.success("Suppression !", { autoClose: 3000 });
    return id;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite lors de la suppression du rappels", { autoClose: 3000 });
    return error;
  }
});
