import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getListBank as getListBankApi,
  getAccountsBankUser as getAccountsBankUserApi,
  insertBankAccount as insertBankAccountApi,
  getAccountBank as getAccountBankApi,
  insertAccountLinkToBank as insertAccountLinkToBankApi
} from "../../helpers/backend_helper";
import { toast } from "react-toastify";

export const getListBank = createAsyncThunk(
  "bankAccount/getListBank",
  async (pays) => {
    try {
      const response = await getListBankApi(pays);
      return response;
    } catch (error) {
      toast.error("Erreur de récupération des listes de banque", { autoClose: 3000 });
      return error;
    }
  }
);

export const getAccountBank = createAsyncThunk(
  "bankAccount/getAccountBank",
  async (insertHandle="null") => {
    try {
      if(insertHandle=="insert"){
        return toast.promise(
          getAccountBankApi(insertHandle),
          {
            pending: 'Récupération des données bancaires',
            success: 'Données bancaires récupérées',
            error: 'Echec de la récupération'
          }
      )
        }else{
          const response = await getAccountBankApi(insertHandle);
          return response;

        }
    } catch (error) {
      console.log(error)
      toast.error("Erreur de lecture comptes bancaires", { autoClose: 3000 });
      return error;
    }
  }
);

export const getAccountsBankUser = createAsyncThunk(
  "bankAccount/getAccountsBankUser",
  async () => {
    try {
      const response = await getAccountsBankUserApi();
      return response;
    } catch (error) {
      toast.error("Erreur de lecture comptes bancaires utilisateur", {
        autoClose: 3000,
      });
      return error;
    }
  }
);

export const insertBankAccount = createAsyncThunk(
  "bankAccount/insertBankAccount",
  async (body) => {
    try {
      const response = await insertBankAccountApi(body);
      if (response.data.link) {
        window.location.replace(response.data.link);
      }
      return response;
    } catch (error) {
      toast.error("Erreur d'insertion du compte bancaire", { autoClose: 3000 });
      return error;
    }
  }
);


export const insertAccountLinkToBank= createAsyncThunk(
  "bankAccount/insertAccountLinkToBank",
  async (body) => {
    try {
      const response = await insertAccountLinkToBankApi(body);
      toast.success("Libellé mis à jour", { autoClose: 3000 });
      return response;
    } catch (error) {
      toast.error("Erreur sur l'ajout/mise à jour du libellé", { autoClose: 3000 });
      return error;
    }
  }
);
