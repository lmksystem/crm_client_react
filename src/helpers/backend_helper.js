
import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

let item_value = JSON.parse(sessionStorage.getItem("authUser"));
// console.log();
/*************************/
/*        Gestion        */
/*************************/

// get Contacts
export const getContacts = () => api.get(url.GET_CONTACTS);
// add Contact
export const addNewContact = contact => api.create(url.ADD_NEW_CONTACT, contact);
// update Contact
export const updateContact = contact => api.update(url.UPDATE_CONTACT + '/' + contact.epe_id, contact);
// delete Contact
export const deleteContact = contact => api.delete(url.DELETE_CONTACT + '/' + contact);


/*************************/
/*        Collabo        */
/*************************/

// get Collaborateurs
export const getCollaborateurs = () => api.get(url.GET_COLLABORATEUR);
// add Collaborateurs
export const addNewCollaborateur = collabo => api.create(url.ADD_NEW_COLLABORATEUR, collabo);
// update Collaborateurs
export const updateCollaborateur = collabo => api.update(url.UPDATE_COLLABORATEUR + '/' + collabo.ent_id, collabo);
// delete Collaborateurs
export const deleteCollaborateur = collabo => api.delete(url.DELETE_COLLABORATEUR + '/' + collabo);


/*************************/
/*          Tva          */
/*************************/

// get tva
export const getTva = () => api.get(url.GET_TVA);
// add tva
export const addNewTva = tva => api.create(url.ADD_NEW_TVA, tva);
// update tva
export const updateTva = tva => api.update(url.UPDATE_TVA + '/' + tva.tva_id, tva);
// delete tva
export const deleteTva = tva => api.delete(url.DELETE_TVA + '/' + tva);



/*************************/
/*      Constantes       */
/*************************/

// get tva
export const getConstantes = () => api.get(url.CONSTANTES);
// add and update constantes
export const handleConstantes = constantes => api.create(url.CONSTANTES, constantes);
// export const addNewTva = tva => api.create(url.ADD_NEW_TVA, tva);
// // update tva
// export const updateTva = tva => api.update(url.UPDATE_TVA + '/' + tva.tva_id, tva);
// // delete tva
// export const deleteTva = tva => api.delete(url.DELETE_TVA + '/' + tva);


/*************************/
/*        Invoice        */
/*************************/

//get Invoices
export const getInvoices = () => api.get(url.GET_INVOICES);

//get widgets data
export const getWidgetInvoices = () => api.get(url.GET_INVOICES + "/widgets");

// add Invoice
export const addNewInvoice = invoice => api.create(url.ADD_NEW_INVOICE, invoice);

// update Invoice
export const updateInvoice = (fen_id, data) => api.update(url.UPDATE_INVOICE + '/' + fen_id, { fen_solde_du: data });

// create pdf Invoice
export const createPdf = invoice => api.get(url.PDF + '/facture/' + invoice);

// send pdf Invoice
export const sendInvocieByEmail = id => api.create(url.PDF + '/facture/' + id);

/*************************/
/*      transaction      */
/*************************/

// Add transaction
export const addNewTransaction = invoice => api.create(url.TRANSACTION, invoice);
// get transaction
export const getTransaction = () => api.get(url.TRANSACTION);
// delete Transaction
export const deleteTransaction = (id) => api.delete(url.TRANSACTION + '/' + id);


/*************************/
/*        Company        */
/*************************/

//get Company
export const getCompany = () => api.get(url.GET_COMPANY);

// // add Company
// export const addNewInvoice = invoice => api.create(url.ADD_NEW_INVOICE, invoice);

// // update Company
// export const updateInvoice = invoice => api.update(url.UPDATE_INVOICE + '/' + invoice._id, invoice);


/*************************/
/*         Auth          */
/*************************/

//  Method
export const postLogin = data => api.create(url.POST_LOGIN, data);


/*************************/
/*        Product        */
/*************************/

//  Method
export const addProduct = data => api.create(url.PRODUCTS, data);

export const getProducts = () => api.get(url.PRODUCTS);

export const updateProduct = product => api.update(url.PRODUCTS + "/" + product.pro_id, product);


/*************************/
/*         Devis         */
/*************************/

export const addNewDevis = data => api.create(url.DEVIS, data);

export const getDevis = () => api.get(url.DEVIS);

export const updateDevis = devis => api.update(url.DEVIS + "/" + devis.den_id, devis);

export const deleteDevis = devis => api.delete(url.DEVIS + "/" + devis);

export const getDevisById = devis => api.get(url.DEVIS + "/" + devis);

export const getDevisForEdit = id => api.get(url.DEVIS + "/edit/" + id);

export const getDevisWidgets = () => api.get(url.DEVIS + "/widgets");

export const SendDevisByEmail = id => api.create(url.PDF + '/devis/' + id);

export const createPdfDevis = devis => api.get(url.PDF + "/devis/" + devis);




