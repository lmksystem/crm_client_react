import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const createUpdateAchat = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.ACHAT, data).then((response) => {
        if (data?.associate) {
          toast.success("Achat mis à jour", { autoClose: 3000 });
        } else {
          toast.success("Achat(s) ajouté(s) !", { autoClose: 3000 });
        }
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de création/mise à jour d'achat", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getAchat = async () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.ACHAT).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur récupération d'achat", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const deleteAchat = async (ach_id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.ACHAT + "/delete/" + ach_id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de suppression d'achat", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getAchatLinkTransaction = async (tba_id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.ACHAT + "/transaction/" + tba_id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération liaison achat/transaction", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const linkTransToAchat = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.TRANSACTION_BANK + "/achat", data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur d'association entre transaction et achat", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const updateMatchAmount = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.TRANSACTION_BANK + "/amountMatch", data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur mise à jour du montant associé", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getCategorieAchat = async () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.ACHAT + "/categorie").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération des catégories d'achat", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getOnceAchat = async (ach_id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.ACHAT + "/" + ach_id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération des catégories d'achat", { autoClose: 3000 });
      reject(error);
    }
  });
};

