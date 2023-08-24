
import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

/**
 *  GESTION
 */

// get Contacts
export const getContacts = () => api.get(url.GET_CONTACTS);
// add Contact
export const addNewContact = contact => api.create(url.ADD_NEW_CONTACT, contact);
// update Contact
export const updateContact = contact => api.update(url.UPDATE_CONTACT + '/' + contact.epe_id, contact);
// delete Contact
export const deleteContact = contact => api.delete(url.DELETE_CONTACT + '/' + contact);

/**
 * Collaborateurs
 */

// get Collaborateurs
export const getCollaborateurs = () => api.get(url.GET_COLLABORATEUR);
// add Collaborateurs
export const addNewCollaborateur = collabo => api.create(url.ADD_NEW_COLLABORATEUR, collabo);
// update Collaborateurs
export const updateCollaborateur = collabo => api.update(url.UPDATE_COLLABORATEUR + '/' + collabo.ent_id, collabo);
// delete Collaborateurs
export const deleteCollaborateur = collabo => api.delete(url.DELETE_COLLABORATEUR + '/' + collabo);

/**
 * Collaborateurs
 */

// get tva
export const getTva = () => api.get(url.GET_TVA);
// add tva
export const addNewTva = tva => api.create(url.ADD_NEW_TVA, tva);
// update tva
export const updateTva = tva => api.update(url.UPDATE_TVA + '/' + tva.tva_id, tva);
// delete tva
export const deleteTva = tva => api.delete(url.DELETE_TVA + '/' + tva);


/**
 * Invoice
 */

//get Invoices
export const getInvoices = () => api.get(url.GET_INVOICES);

//get Invoice by id 
export const getInvoiceById = (id) => api.get(url.GET_INVOICES + "/" + id);

// add Invoice
export const addNewInvoice = invoice => api.create(url.ADD_NEW_INVOICE, invoice);

// update Invoice
export const updateInvoice = invoice => api.update(url.UPDATE_INVOICE + '/' + invoice._id, invoice);

// delete Invoice
export const deleteInvoice = invoice => api.delete(url.DELETE_INVOICE + '/' + invoice);

/**
 * Company
 */

//get Company
export const getCompany = () => api.get(url.GET_COMPANY);

// // add Company
// export const addNewInvoice = invoice => api.create(url.ADD_NEW_INVOICE, invoice);

// // update Company
// export const updateInvoice = invoice => api.update(url.UPDATE_INVOICE + '/' + invoice._id, invoice);

// // delete Company
// export const deleteInvoice = invoice => api.delete(url.DELETE_INVOICE + '/' + invoice);

/**
 * Login
 */

//  Method
export const postLogin = data => api.create(url.POST_LOGIN, data);

/**
 * product
 */

//  Method
export const addProduct = data => api.create(url.ADD_NEW_PRODUCT, data);

export const getProducts = () => api.get(url.GET_PRODUCTS);

export const updateProduct = product => api.update(url.UPDATE_PRODUCT + "/" + product.pro_id, product);