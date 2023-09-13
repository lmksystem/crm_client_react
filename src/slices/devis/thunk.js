import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
  getDevis as getDevisApi,
  addNewDevis as addNewDevisApi,
  updateDevis as updateDevisApi,
  deleteDevis as deleteDevisApi,
  getDevisById as getDevisByIdApi,
  createPdfDevis as createPdfDevisApi,
  getDevisForEdit as getDevisForEditApi,
  getDevisWidgets as getDevisWidgetsApi,
  SendDevisByEmail as SendDevisByEmailApi,
  getEtatDevis as getEtatDevisApi,
  getDevisPeriodCount as getDevisPeriodCountApi,
  getDevisByMonth as getDevisByMonthApi,
} from "../../helpers/backend_helper";

export const getDevis = createAsyncThunk("devis/getDevis", async () => {
  try {
    const response = getDevisApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewDevis = createAsyncThunk("devis/addNewDevis", async (Devis) => {
  try {
    const response = addNewDevisApi(Devis);
    toast.success("Devis Added Successfully", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Devis Added Failed", { autoClose: 3000 });
    return error;
  }
});

export const updateDevis = createAsyncThunk("devis/updateDevis", async (Devis) => {
  try {
    const response = updateDevisApi(Devis);
    toast.success("Devis Updated Successfully", { autoClose: 3000 });
    const data = await response;
    return data;
  } catch (error) {
    toast.error("Devis Updated Failed", { autoClose: 3000 });
    return error;
  }
});

export const deleteDevis = createAsyncThunk("devis/deleteDevis", async (devis) => {
  try {
    const response = deleteDevisApi(devis);
    toast.success("Devis Delete Successfully", { autoClose: 3000 });
    return devis;
  }
  catch (error) {
    toast.error("Devis Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const getDevisById = createAsyncThunk("devis/getDevisById", async (Devis) => {
  try {
    const response = await getDevisByIdApi(Devis);

    return response;
  }
  catch (error) {
    toast.error("Devis Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const createPdfDevis = createAsyncThunk("devis/createPdfDevis", async (devis) => {
  try {
    const response = createPdfDevisApi(devis);

    return response;
  }
  catch (error) {
    console.log("thunk catch");
    toast.error("devis Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const getDevisForEdit = createAsyncThunk("devis/getDevisForEdit", async (id) => {
  try {
    const response = getDevisForEditApi(id);

    return response;
  }
  catch (error) {
    console.log("thunk catch");
    toast.error("devis Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const getDevisWidgets = createAsyncThunk("devis/getDevisWidgets", async () => {
  try {
    const response = getDevisWidgetsApi();

    return response;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite sur la récupération des devis", { autoClose: 3000 });
    return error;
  }
});

export const SendDevisByEmail = createAsyncThunk("devis/SendDevisByEmail", async (id) => {
  try {
    const response = SendDevisByEmailApi(id);

    return response;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite sur l'envois de devis par mail", { autoClose: 3000 });
    return error;
  }
});

export const getEtatDevis = createAsyncThunk("devis/getEtatDevis", async (id) => {
  try {
    const response = getEtatDevisApi(id);
    return response;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite sur la lecture de l'état d'un devis", { autoClose: 3000 });
    return error;
  }
});


export const getDevisPeriodCount= createAsyncThunk("devis/getDevisPeriodCount", async (data) => {
  try {
    const response = getDevisPeriodCountApi(data);
    return response;
  } catch (error) {
    console.log("thunk catch", error);
    toast.error("Une erreur s'est produite sur la lecture des devis", { autoClose: 3000 });
    return error;
  }
});

export const getDevisByMonth = createAsyncThunk("devis/getDevisByMonth", async (data) => {
  try {
    const response =await getDevisByMonthApi(data);
    return response;
  } 
  catch (error) {
    console.log("thunk catch", error);
    toast.error("Transaction Read Failed", { autoClose: 3000 });
    return error;
  }
});