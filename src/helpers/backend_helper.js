
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
export const updateContact = contact => api.put(url.UPDATE_CONTACT + '/' + contact.epe_id, contact);
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
export const updateCollaborateur = collabo => api.put(url.UPDATE_COLLABORATEUR + '/' + collabo.ent_id, collabo);
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
export const updateTva = tva => api.create(url.UPDATE_TVA + '/' + tva.tva_id, tva);
// delete tva
export const deleteTva = tva => api.delete(url.DELETE_TVA + '/' + tva);

/**
 * Login
 */

//  Method
export const postLogin = data => api.create(url.POST_LOGIN, data);