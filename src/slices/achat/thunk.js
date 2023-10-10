import { createAsyncThunk } from "@reduxjs/toolkit";
import {
createUpdateAchat as createUpdateAchatApi,
getAchat as getAchatApi,
deleteAchat as deleteAchatApi,
getAchatLinkTransaction as getAchatLinkTransactionApi,
linkTransToAchat as linkTransToAchatApi,
updateMatchAmount as updateMatchAmountApi
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const createUpdateAchat= createAsyncThunk("achat/createUpdateAchat", async (data) => {
  try {
    const response = await createUpdateAchatApi(data);
    return response;
  }
  catch (error) {
    toast.error("Achat Post Failed", { autoClose: 3000 });
    return error;
  }
});

export const getAchat = createAsyncThunk("achat/getAchat", async (year) => {
  try {
    const response = await getAchatApi(year);
    return response;
  }
  catch (error) {
    toast.error("Achat Get Failed", { autoClose: 3000 });
    return error;
  }
});


export const deleteAchat = createAsyncThunk("achat/deleteAchat", async (id) => {
  try {
    const response =await deleteAchatApi(id);
    return response;
  }
  catch (error) {
    toast.error("Achat Delete Failed", { autoClose: 3000 });
    return error;
  }
});

export const getAchatLinkTransaction = createAsyncThunk("achat/getAchatLinkTransaction", async (tba_id) => {
  try {
    const response = await getAchatLinkTransactionApi(tba_id);
    return response;
  }
  catch (error) {
    toast.error("Achat Get Failed", { autoClose: 3000 });
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
      toast.error("Transaction Bank link Achat Update Failed", { autoClose: 3000 });
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
      toast.error("Transaction Bank Match Amount Update  Failed", { autoClose: 3000 });
      return error;
    }
  }
);
