import { createAsyncThunk } from "@reduxjs/toolkit";
import {
createUpdateAchat as createUpdateAchatApi,
getAchat as getAchatApi,
deleteAchat as deleteAchatApi
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
    const response = deleteAchatApi(id);
    return response;
  }
  catch (error) {
    toast.error("Achat Delete Failed", { autoClose: 3000 });
    return error;
  }
});
