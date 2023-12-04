import { createAsyncThunk } from "@reduxjs/toolkit";
import {
getEmail as getEmailApi,
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";


export const getEmail = createAsyncThunk("email/getEmail", async () => {
  try {
    const response = await getEmailApi();
    return response;
  }
  catch (error) {
    toast.error("Erreur de récupération d'email", { autoClose: 3000 });
    return error;
  }
});

