import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getRecurrences = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.RECURRENCE).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récuperation récurrence", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const addRecurrence = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.RECURRENCE, data).then((response) => {
        toast.success("récurrence ajouté", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de d'ajout récurrence", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const deleteRecurrence = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.RECURRENCE + "/" + id).then((response) => {
        toast.success("produit supprimer", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de suppresion récurrence", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getRecurrenceOfEntity = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.RECURRENCE + "/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Echec de la récuperation", { autoClose: 3000 });
      reject(error);
    }
  });
};
