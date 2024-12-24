import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getDevis = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.DEVIS).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur récupération des devis", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getDevisById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.DEVIS + "/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur récupération de devis", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const createPdfDevis = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.PDF + "/devis/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de création de devis", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getDevisForEdit = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.DEVIS + "/edit/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération de devis", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getDevisWidgets = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.DEVIS + "/widgets").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite sur la récupération des devis", {
        autoClose: 3000
      });
      reject(error);
    }
  });
};

export const SendDevisByEmail = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.PDF + "/devis/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite sur l'envois de devis par mail", {
        autoClose: 3000
      });
      reject(error);
    }
  });
};

export const getEtatDevis = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.DEVIS + "/etat").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite sur la lecture de l'état d'un devis", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getDevisPeriodCount = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.DEVIS + "/devis_periode/" + data.dateDebut + "/" + data.dateFin).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite sur la lecture des devis", {
        autoClose: 3000
      });
      reject(error);
    }
  });
};

export const getDevisByMonth = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.DEVIS + "/byMonth/" + data.year).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de lecture des devis", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getEtatDevisByEntId = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get("/v1/devis/entity/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de lecture des devis", { autoClose: 3000 });
      reject(error);
    }
  });
};
