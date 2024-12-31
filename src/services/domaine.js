import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getDomaineList = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get("/v1/domaine/entity").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
