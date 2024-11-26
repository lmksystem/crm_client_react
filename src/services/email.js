import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getEmail = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.EMAIL).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de récupération d'email", { autoClose: 3000 });
      reject(error);
    }
  });
};
