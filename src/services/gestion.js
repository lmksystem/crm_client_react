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

export const addNewCollaborateur = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.ADD_NEW_COLLABORATEUR, data).then((response) => {
        toast.success("Nouveau client/fournisseur ajouté", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur d'ajout de contact", { autoClose: 3000 });
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

export const deleteCollaborateurs = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.DELETE_COLLABORATEUR + "/" + id).then((response) => {
        toast.success("Client/fournisseur supprimé", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur suppression client/fournisseur", { autoClose: 3000 });
      reject(error);
    }
  });
};

// parametre

export const getTva = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.GET_TVA).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur récupération tva", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const addNewTva = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.ADD_NEW_TVA, data).then((response) => {
        toast.success("TVA bien ajouté", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur ajout TVA", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const updateTva = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.update(url.UPDATE_TVA + "/" + data.tva_id, data).then((response) => {
        toast.success("TVA bien msie à jour", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur mise à jour de TVA", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const deleteTva = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.DELETE_TVA + "/" + id).then((response) => {
        toast.success("TVA supprimée", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur suppression TVA", { autoClose: 3000 });
      reject(error);
    }
  });
};

//Constantes

export const getConstantes = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.CONSTANTES).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur récupération", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const handleConstantes = (constantes) => {
  return new Promise(async (resolve, reject) => {
    try {
      let arrayResponse = [];
      for (let index = 0; index < constantes.length; index++) {
        const newConst = constantes[index];
        let reponse = await api.create(url.CONSTANTES, newConst);
        arrayResponse.push(reponse.data);
      }
      toast.success("Enregistrer !", { autoClose: 3000 });
      resolve(arrayResponse);
    } catch (error) {
      toast.error("Echec !", { autoClose: 3000 });
      return error;
    }
  });
};

export const getEntityPeriodCount = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.ENTITY + "/entity_periode/" + data.dateDebut + "/" + data.dateFin).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite sur la récupération des fournisseurs", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const handleAlert = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.ALERT, data).then((response) => {
        toast.success("Enregistrer !", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite à la création du rappel", {
        autoClose: 3000
      });
      reject(error);
    }
  });
};

export const getAlert = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.ALERT).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la récupération des rappels", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const deleteAlert = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.ALERT + "/" + id).then((response) => {
        toast.success("Suppression !", { autoClose: 3000 });
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la suppression du rappels", { autoClose: 3000 });
      reject(error);
    }
  });
};
