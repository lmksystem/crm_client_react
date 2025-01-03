import { toast } from "react-toastify";
import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";

const api = new APIClient();

export const createPaymentIntent = (paymentData) => {
  return new Promise((resolve, reject) => {
    try {
      api.create("/v1/stripe/payment-intent", paymentData).then((response) => {
        console.log(response);

        resolve(response);
      });
    } catch (error) {
      toast.error("Erreur de création de l'intention de paiement", { autoClose: 3000 });
      reject(error);
    }
  });
};

// export const retrievePaymentIntent = (paymentIntentId) => {
//   return new Promise((resolve, reject) => {
//     try {
//       api.get(`${url.RETRIEVE_PAYMENT_INTENT}/${paymentIntentId}`).then((response) => {
//         resolve(response.data);
//       });
//     } catch (error) {
//       toast.error("Erreur de récupération de l'intention de paiement", { autoClose: 3000 });
//       reject(error);
//     }
//   });
// };

// export const updatePaymentIntent = (paymentIntentId, updateData) => {
//   return new Promise((resolve, reject) => {
//     try {
//       api.create(`${url.UPDATE_PAYMENT_INTENT}/${paymentIntentId}`, updateData).then((response) => {
//         resolve(response.data);
//       });
//     } catch (error) {
//       toast.error("Erreur de mise à jour de l'intention de paiement", { autoClose: 3000 });
//       reject(error);
//     }
//   });
// };

// export const cancelPaymentIntent = (paymentIntentId) => {
//   return new Promise((resolve, reject) => {
//     try {
//       api.create(`${url.CANCEL_PAYMENT_INTENT}/${paymentIntentId}`).then((response) => {
//         resolve(response.data);
//       });
//     } catch (error) {
//       toast.error("Erreur d'annulation de l'intention de paiement", { autoClose: 3000 });
//       reject(error);
//     }
//   });
// };
