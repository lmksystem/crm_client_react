import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getTransactionBank = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.TRANSACTION_BANK + "/periode/" + data.dateDebut + "/" + data.dateFin).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération de transaction", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getTransactionBankAchat = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.TRANSACTION_BANK + "/achat/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération de transaction", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const updateJustifyTransactionBank = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.TRANSACTION_BANK + "/justify", data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de mise à jour de justificatif", { autoClose: 3000 });
      reject(error);
    }
  });
};
