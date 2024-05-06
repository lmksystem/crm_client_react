import { createAsyncThunk } from "@reduxjs/toolkit";
import { getListBank as getListBankApi, getAccountsBankUser as getAccountsBankUserApi, insertBankAccount as insertBankAccountApi, getAccountBank as getAccountBankApi, insertAccountLinkToBank as insertAccountLinkToBankApi } from "../../helpers/backend_helper";
import { toast } from "react-toastify";
import axios from "axios";

export const getListBank = createAsyncThunk("bankAccount/getListBank", async (pays) => {
  try {
    const response = await getListBankApi(pays);
    return response;
  } catch (error) {
    toast.error("Erreur de récupération des listes de banque", { autoClose: 3000 });
    return error;
  }
});

export const getAccountBank = createAsyncThunk("bankAccount/getAccountBank", async (insertHandle = "null") => {
  try {
    if (insertHandle == "insert") {
      return toast.promise(getAccountBankApi(insertHandle), {
        pending: "Récupération des données bancaires",
        success: "Données bancaires récupérées",
        error: "Echec de la récupération"
      });
    } else {
      const response = await getAccountBankApi(insertHandle);
      return response;
    }
  } catch (error) {
    console.log(error);
    toast.error("Erreur de lecture comptes bancaires", { autoClose: 3000 });
    return error;
  }
});

export const getAccountsBankUser = createAsyncThunk("bankAccount/getAccountsBankUser", async () => {
  try {
    const response = await getAccountsBankUserApi();
    return response;
  } catch (error) {
    toast.error("Erreur de lecture comptes bancaires utilisateur", {
      autoClose: 3000
    });
    return error;
  }
});

export const insertBankAccount = createAsyncThunk("bankAccount/insertBankAccount", async (body) => {
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
});

export const insertAccountLinkToBank = createAsyncThunk("bankAccount/insertAccountLinkToBank", async (body) => {
  try {
    const response = await insertAccountLinkToBankApi(body);
    toast.success("Compte mis à jour", { autoClose: 3000 });
    return response;
  } catch (error) {
    toast.error("Erreur sur l'ajout/mise à jour", { autoClose: 3000 });
    return error;
  }
});

/**
 *  NOUVELLE VERSION DES BANK
 */

/**
 * Permet de recuperer les comptes bancaire de leur societe
 * @returns
 */
export const getBankUserAccount = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/v1/userBank`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Retire un compte bancaire
 * @param {*} id
 */
export const removeBankAccountApi = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete("/v1/bankAccount?id=" + id)
      .then(() => {
        resolve(id);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
