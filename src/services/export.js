import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const dowloadExport = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.EXPORT, data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
