import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getReportData = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.REPORT, data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      toast.error("Erreur de la recupération", { autoClose: 3000 });
      reject(error);
    }
  });
};
