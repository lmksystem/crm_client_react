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
