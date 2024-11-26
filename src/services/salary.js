import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import axios from "axios";

const api = new APIClient();

export async function upload(file) {
  return new Promise((resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      api
        .create("/v1/upload/salary", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((response) => {
          resolve(response.data);
        });
    } catch (error) {
      toast.error("Erreur lors du téléchargement de l'image", { autoClose: 3000 });
      reject(error);
    }
  });
}

export async function download(sal_id) {
  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`/v1/pdf/download/salary/${sal_id}`, {
          mode: "no-cors",
          responseType: "blob"
        })
        .then(async (response) => {
          try {
            const pdfBlob = new Blob([response], { type: "application/pdf" });
            resolve(window.URL.createObjectURL(pdfBlob));
          } catch (err) {
            reject(err);
          }
        });
    } catch (error) {
      toast.error("Erreur lors du téléchargement de l'image", { autoClose: 3000 });
      reject(error);
    }
  });
}
