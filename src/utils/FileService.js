import axios from "axios";
import { APIClient } from "../helpers/api_helper";

async function uploadFile(files) {
  const formData = new FormData();
  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    formData.append("fileName", element);
  }
  return await axios
    .post("/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return {
          status: 400,
          data: "Une erreur est survenue lors de l'upload du fichier",
        };
      }
    })
    .catch((error) => {
        console.log(error)
      return {
        status: 400,
        data: "Une erreur est survenue lors de l'upload du fichier",
      };
    });
}

export default { uploadFile };
