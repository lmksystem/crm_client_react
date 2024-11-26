import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const getEmployees = () => {
  return new Promise((resolve, reject) => {
    try {
      api.get(url.EMPLOYEES + "/employees").then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const createUpdateEmployee = (data) => {
  return new Promise((resolve, reject) => {
    try {
      api.create(url.EMPLOYEES, data).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteEmployee = (id) => {
  return new Promise((resolve, reject) => {
    try {
      api.delete(url.EMPLOYEES + "/" + id).then((response) => {
        resolve(response.data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
