import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";


const api = new APIClient();

// export const addNewTransaction = (invoice) => {
//   return new Promise((resolve, reject) => {
//     try {
//       api
//         .create(url.TRANSACTION, invoice)
//         .then((response) => {
//           resolve(response.data);
//         })
//         .catch((e) => {
//           reject(e);
//         });
//     } catch (error) {
//       toast.error("Erreur de creation de la transaction", { autoClose: 3000 });
//       reject(error);
//     }
//   });
// };