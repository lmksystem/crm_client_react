import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const createMandate = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create("/v1/mandate", data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lors de la création du mandat", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getMandates = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get("/v1/mandate").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lors de la récupération des mandats", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getMandateById = (mandate_id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(`/v1/mandate/${mandate_id}`).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lors de la récupération du mandat", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const updateMandate = (mandate_id, data) => {
  return new Promise((resolve, reject) => {
    try {
      api.put(`/v1/mandate/${mandate_id}`, data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du mandat", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const cancelMandate = (mandate_id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(`/v1/mandate/${mandate_id}`).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lors de l'annulation du mandat", { autoClose: 3000 });
      reject(error);
    }
  });
};