import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import { getInvoices } from "./invoice";

const api = new APIClient();

export const getContacts = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.GET_CONTACTS).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur récupération des contacts", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const addNewContact = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.ADD_NEW_CONTACT, data).then((response) => {
        toast.success("Contact ajouté", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur ajout contact", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const updateContact = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.update(url.UPDATE_CONTACT + "/" + data.epe_id, data).then((response) => {
        toast.success("Contact mis à jour", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur mise à jour de contact", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const deleteContact = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.DELETE_CONTACT + "/" + id).then((response) => {
        toast.success("Contact suppirmé", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur suppression de contact", { autoClose: 3000 });
      reject(error);
    }
  });
};

// Collaborateurs

export const getCollaborateurs = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.GET_COLLABORATEUR).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération de contact", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getDetailsCollabo = (item) => {
  return new Promise((resolve, reject) => {
    try {
      let response = {};
      response.infoBase = item;
      getInvoices({
        dateDebut: null,
        dateFin: null
      }).then((InvoicesCollabo) => {
        let InvoicesByCollabo = InvoicesCollabo?.filter((inv) => inv.header.fen_ent_fk == item.ent_id) || [];
        response.invoices = InvoicesByCollabo;
        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateCollaborateur = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.update(url.UPDATE_COLLABORATEUR + "/" + data.ent_id, data).then((response) => {
        toast.success("Client/fournisseur mis à jour", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur mise à jour", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getCollaborateurById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.get("v1/entity/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite lors dela récuperation du collaborateur", { autoClose: 3000 });
      reject(error);
    }
  });
};
