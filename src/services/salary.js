import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const createUpdateSalary = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.SALARY, data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur d'ajout / mise à jour de salaire", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const getSalary = (year) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.SALARY + "/" + year).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération de salaire", { autoClose: 3000 });
      reject(error);
    }
  });
};

export const deleteSalary = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.SALARY + "/delete/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération de salaire", { autoClose: 3000 });
      reject(error);
    }
  });
};
