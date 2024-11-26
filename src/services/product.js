import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getProducts = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.PRODUCTS).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération des produits", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const addProduct = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.PRODUCTS, data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de création du produit", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const updateProduct = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.update(url.PRODUCTS + "/" + data.pro_id, data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de mise à jour du produit", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.PRODUCTS + "/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de suppression du produit", { autoClose: 3000 });
      reject(error);
    }
  });
};
