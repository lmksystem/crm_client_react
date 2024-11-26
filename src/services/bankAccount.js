import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getListBank = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.LIST_BANK + "/" + data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération des listes de banque", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getAccountBank = (insertHandle) => {
  return new Promise((resolve, reject) => {
    try {
      if (insertHandle == "insert") {
        return toast.promise(api.get(url.BANK_ACCOUNT + "/link/" + insertHandle), {
          pending: "Récupération des données bancaires",
          success: "Données bancaires récupérées",
          error: "Echec de la récupération"
        });
      } else {
        api.get(url.BANK_ACCOUNT + "/link/" + insertHandle).then(() => {
          resolve(response.data);
        });
      }
    } catch (error) {
      toast.error("Erreur de lecture comptes bancaires", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getAccountsBankUser = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.BANK_ACCOUNT).then((response) => {
        resolve(response);
      });
    } catch (error) {
      toast.error("Erreur de lecture comptes bancaires utilisateur", {
        autoClose: 3000
      });
      reject(error);
    }
  });
};

export const insertBankAccount = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.BANK_ACCOUNT, data).then((response) => {
        if (response.data.link) {
          window.location.replace(response.data.link);
        }
        resolve(response);
      });
    } catch (error) {
      toast.error("Erreur d'insertion du compte bancaire", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const insertAccountLinkToBank = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.BANK_ACCOUNT + "/link", data).then((response) => {
        toast.success("Compte mis à jour", { autoClose: 3000 });
        resolve(response);
      });
    } catch (error) {
      toast.error("Erreur sur l'ajout/mise à jour", { autoClose: 3000 });
      reject(error);
    }
  });
};

/**
 *  NOUVELLE VERSION DES BANK
 */

/**
 * Permet de recuperer les comptes bancaire de leur societe
 * @returns
 */
export const getBankUserAccount = () => {
  return new Promise((resolve, reject) => {
    api
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
    api
      .delete("/v1/bankAccount?id=" + id)
      .then(() => {
        resolve(id);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
