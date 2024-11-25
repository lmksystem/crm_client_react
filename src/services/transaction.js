import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const addNewTransaction = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      api
        .create(url.TRANSACTION, invoice)
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (error) {
      toast.error("Erreur de creation de la transaction", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getTransaction = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.TRANSACTION).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération de transaction", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const sendInvocieByEmail = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.PDF + "/facture/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const deleteTransaction = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.TRANSACTION + "/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de suppression de transaction", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getTransactionList = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.TRANSACTION + "/list").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Echec de récuperation de transaction", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getTransactionPricePeriode = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.TRANSACTION + "/price_periode/" + data.dateDebut + "/" + data.dateFin).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur récupération des transactions par période", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getTransactionByMonth = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.TRANSACTION + "/byMonth/" + data.year).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur récupération des transactions par période", { autoClose: 3000 });
      reject(error);
    }
  });
};
