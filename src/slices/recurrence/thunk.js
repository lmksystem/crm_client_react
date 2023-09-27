import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
  getRecurrences as getRecurrencesApi,
  addRecurrence as addRecurrenceApi,
  getRecurrenceOfEntity as getRecurrenceOfEntityApi,
  deleteRecurrence as deleteRecurrenceApi
} from "../../helpers/backend_helper";

export const getRecurrences = createAsyncThunk("recurrence/getRecurrence", async () => {
  try {
    const response = getRecurrencesApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addRecurrence = createAsyncThunk("recurrence/addRecurrence", async (recurrence) => {
  try {
    const response = addRecurrenceApi(recurrence);
    toast.success("Produit ajouté", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Echec de l'ajout", { autoClose: 3000 });
    return error;
  }
});

export const deleteRecurrence = createAsyncThunk("recurrence/DeleteRecurrence", async (rec_id) => {
  try {
    const response = deleteRecurrenceApi(rec_id);
    toast.success("Produit supprimé", { autoClose: 3000 });
    return rec_id;
  } catch (error) {
    toast.error("Echec de l'ajout", { autoClose: 3000 });
    return error;
  }
});

export const getRecurrenceOfEntity  = createAsyncThunk("recurrence/getRecurrenceOfEntity ", async (rec_id) => {
  try {
    const response = getRecurrenceOfEntityApi(rec_id);
    // toast.success("Produit supprimé", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Echec de la récuperation", { autoClose: 3000 });
    return error;
  }
});