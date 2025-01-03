import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getInvoices = async () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.INVOICES).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récuperation");
    }
  });
};

export const getWidgetInvoices = async () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.INVOICES + "/widgets").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récuperation");
    }
  });
};

export const getInvoiceById = async (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.INVOICES + "/once/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récuperation");
    }
  });
};

export const addNewInvoice = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.INVOICES, data).then((response) => {
        toast.success("Ajout de facture réussi", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur d'ajout facture", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const updateInvoice = (data) => {
  console.log("------",data);
  
  return new Promise((resolve, reject) => {
    try {
      api.update(url.INVOICES + "/" + data.fen_id, data).then((response) => {
        toast.success("Mise à jour de facture réussi", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur mise à jour de facture", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const createPdf = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.PDF + "/facture/" + invoice).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Création du pdf echoué", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getInvoicePeriodCount = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.INVOICES + "/invoice_periode/" + data.dateDebut + "/" + data.dateFin).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Création du pdf echoué", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getInvoiceByMonth = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.INVOICES + "/byMonth/" + data.year).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lecture des factures", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getEtatInvoice = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get("/v1/facture/etat").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lecture des factures", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getInvoicesPaid = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get("/v1/invoices/paid/" + data.dateDebut + "/" + data.dateFin).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lecture des factures", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getInvoiceByEntId = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get("/v1/invoice/entity").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur lecture des factures", { autoClose: 3000 });
      reject(error);
    }
  });
};
