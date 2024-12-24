import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getCompany = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.COMPANY).then((response) => {
        resolve(response.data[0]);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const createOrUpdateCompany = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.post(url.COMPANY_2, data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateCompany = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.COMPANY_2 + "/update", data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const addLicense = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create("/v1/user/license", data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const getLicense = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get("/v1/user/license").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const deleteLicense = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete("/v1/user/license/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
