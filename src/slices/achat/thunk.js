import { createAsyncThunk } from "@reduxjs/toolkit";
import {
createUpdateAchat as createUpdateAchatApi,
getAchat as getAchatApi,
deleteAchat as deleteAchatApi,
getAchatLinkTransaction as getAchatLinkTransactionApi,
linkTransToAchat as linkTransToAchatApi,
updateMatchAmount as updateMatchAmountApi,
getCategorieAchat as getCategorieAchatApi
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const createUpdateAchat= createAsyncThunk("achat/createUpdateAchat", async (data) => {
  try {
    const response = await createUpdateAchatApi(data);
    if(data?.associate){
      toast.success('Achat mis à jour', { autoClose: 3000 })
    }else{
      toast.success('Achat(s) ajouté(s) !', { autoClose: 3000 })
    }
    return response;
  }
  catch (error) {
    toast.error("Erreur de création/mise à jour d'achat", { autoClose: 3000 });
    return error;
  }
});

export const getAchat = createAsyncThunk("achat/getAchat", async () => {
  try {
    const response = await getAchatApi();
    console.log(response);
    return response;
  }
  catch (error) {
    toast.error("Erreur récupération d'achat", { autoClose: 3000 });
    return error;
  }
});


export const deleteAchat = createAsyncThunk("achat/deleteAchat", async (id) => {
  try {
    const response =await deleteAchatApi(id);
    return response;
  }
  catch (error) {
    toast.error("Erreur de suppression d'achat", { autoClose: 3000 });
    return error;
  }
});

export const getAchatLinkTransaction = createAsyncThunk("achat/getAchatLinkTransaction", async (tba_id) => {
  try {
    const response = await getAchatLinkTransactionApi(tba_id);
    return response;
  }
  catch (error) {
    toast.error("Erreur de récupération liaison achat/transaction", { autoClose: 3000 });
    return error;
  }
});

export const linkTransToAchat = createAsyncThunk(
  "achat/linkTransToAchat",
  async (body) => {
    try {
      const response = await linkTransToAchatApi(body);
      return response;
    } catch (error) {
      toast.error("Erreur d'association entre transaction et achat", { autoClose: 3000 });
      return error;
    }
  }
);


export const updateMatchAmount = createAsyncThunk(
  "achat/updateMatchAmount",
  async (body) => {
    try {
      const response = await updateMatchAmountApi(body);
      return response;
    } catch (error) {
      toast.error("Erreur mise à jour du montant associé", { autoClose: 3000 });
      return error;
    }
  }
);

export const getCategorieAchat = createAsyncThunk(
  "achat/getCategorieAchat",
  async (body) => {
    try {
      const response = await getCategorieAchatApi(body);
      return response;
    } catch (error) {
      toast.error("Erreur de récupération des catégories d'achat", { autoClose: 3000 });
      return error;
    }
  }
);
