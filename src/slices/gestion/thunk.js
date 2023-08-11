import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
} from "../../helpers/backend_helper";


// Gestion 

export const getContacts = createAsyncThunk("gestion/getContacts" , async () => {
  try{
    const response = getContactsApi()
    return response;
  }catch (error) {
    return error;
  }
})

export const addNewContact = createAsyncThunk("gestion/addNewContact" , async (contact) => {
  try{
    const response = await addNewContactApi(contact)
  
    toast.success("Contact Added Successfully", { autoClose: 3000 });
    return { epe_id: response.data.insertId ,...contact};
  }catch (error) {
    toast.error("Contact Added Failed", { autoClose: 3000 });
    return error;
  }
})

export const updateContact = createAsyncThunk("gestion/updateContact" , async (contact) => {
  try{
    const response = await updateContactApi(contact)
    toast.success("Contact Updated Successfully", { autoClose: 3000 });
    return contact;
  }catch (error) {
    toast.error("Contact Updated Failed", { autoClose: 3000 });
    return error;
  }
})

export const deleteContact = createAsyncThunk("gestion/deleteContact" , async (contact) => {
  try{
    const response = deleteContactApi(contact)
    toast.success("Contact Deleted Successfully", { autoClose: 3000 });
    return contact;
  }catch (error) {
    toast.error("Contact Deleted Failed", { autoClose: 3000 });
    return error;
  }
})

// Collaborateurs

export const getCollaborateurs = createAsyncThunk("gestion/getCollaborateurs" , async () => {
  try{
    const response = getCollaborateursApi()
    return response;
  }catch (error) {
    return error;
  }
})

export const addNewCollaborateur = createAsyncThunk("gestion/addNewCollaborateur" , async (collabo) => {
  try{
    const response = await addNewCollaborateurApi(collabo)
  
    toast.success("Contact Added Successfully", { autoClose: 3000 });
    return response.data;
  }catch (error) {
    toast.error("Contact Added Failed", { autoClose: 3000 });
    return error;
  }
})

export const updateCollaborateur = createAsyncThunk("gestion/updateCollaborateur" , async (collabo) => {
  try{
    const response = await updateCollaborateurApi(collabo)
    toast.success("Collaborateur Updated Successfully", { autoClose: 3000 });
    return response.data;
  }catch (error) {
    toast.error("Collaborateur Updated Failed", { autoClose: 3000 });
    return error;
  }
})

export const deleteCollaborateurs = createAsyncThunk("gestion/deleteCollaborateur" , async (collabo) => {
  try{
    const response = deleteCollaborateurApi(collabo)
    toast.success("Collaborateur Deleted Successfully", { autoClose: 3000 });
    return collabo;
  }catch (error) {
    toast.error("Collaborateur Deleted Failed", { autoClose: 3000 });
    return error;
  }
})

export const onAddNewClientCompta = createAsyncThunk("gestion/onAddNewClientCompta" , async (collabo) => {
  try{
    const response = onAddNewClientCompta(collabo)
    toast.success("Collaborateur Deleted Successfully", { autoClose: 3000 });
    return collabo;
  }catch (error) {
    toast.error("Collaborateur Deleted Failed", { autoClose: 3000 });
    return error;
  }
})
