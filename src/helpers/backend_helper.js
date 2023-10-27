
import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

let item_value = JSON.parse(sessionStorage.getItem("authUser"));

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
//get entity sur period
export const getEntityPeriodCount = data => api.get(url.ENTITY + "/entity_periode/"+data.dateDebut+ '/' +data.dateFin);


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
export const getConstantes = async() => api.get(url.CONSTANTES);
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
export const getInvoices = () => api.get(url.INVOICES);

//get widgets data
export const getWidgetInvoices = () => api.get(url.INVOICES + "/widgets");

// add Invoice
export const addNewInvoice = invoice => api.create(url.INVOICES, invoice);

// update Invoice
export const updateInvoice = (fen_id, data) => api.update(url.INVOICES + '/' + fen_id, { fen_solde_du: data });

// create pdf Invoice
export const createPdf = invoice => api.get(url.PDF + '/facture/' + invoice);

// send pdf Invoice
export const sendInvocieByEmail = id => api.create(url.PDF + '/facture/' + id);

// get invoice sur period
export const getInvoicePeriodCount = data => api.get(url.INVOICES + "/invoice_periode/"+data.dateDebut+ '/' +data.dateFin);

// get invoice par mois par annéee
export const getInvoiceByMonth = data => api.get(url.INVOICES + '/byMonth/'+data.year);


/*************************/
/*      transaction      */
/*************************/

// Add transaction
export const addNewTransaction = invoice => api.create(url.TRANSACTION, invoice);
// get transaction
export const getTransaction = () => api.get(url.TRANSACTION);
// delete Transaction
export const deleteTransaction = (id) => api.delete(url.TRANSACTION + '/' + id);
// get tarnsaction liste avec jointure sur facture et entity
export const getTransactionList = (id) => api.get(url.TRANSACTION + '/list');
// get transaction sur period
export const getTransactionPricePeriode = data => api.get(url.TRANSACTION + '/price_periode/'+data.dateDebut+ '/' +data.dateFin);
// get transaction sur period
export const getTransactionByMonth = data => api.get(url.TRANSACTION + '/byMonth/'+data.year);


/*************************/
/*   transaction bank    */
/*************************/

// get transaction bank
export const getTransactionBank = data => api.get(url.TRANSACTION_BANK+'/periode/'+data.dateDebut+ '/' +data.dateFin);

// get transaction bank and link achat
export const getTransactionBankAchat = ach_id => api.get(url.TRANSACTION_BANK+'/achat/'+ach_id);

// update justify transaction bank
export const updateJustifyTransactionBank = data => api.create(url.TRANSACTION_BANK+'/justify',data);



/*************************/
/*        Company        */
/*************************/

//get Company
export const getCompany = () => api.get(url.COMPANY);

// add or update company
export const createOrUpdateCompany = (data) => api.post(url.COMPANY_2, data);

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

export const deleteProduct = pro_id => api.delete(url.PRODUCTS + "/" + pro_id);


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

export const getEtatDevis = () => api.get(url.DEVIS + "/etat");

export const SendDevisByEmail = id => api.create(url.PDF + '/devis/' + id);

export const createPdfDevis = devis => api.get(url.PDF + "/devis/" + devis);

export const getDevisPeriodCount = data => api.get(url.DEVIS + "/devis_periode/"+data.dateDebut+ '/' +data.dateFin);

export const getDevisByMonth = data => api.get(url.DEVIS + '/byMonth/'+data.year);



/*************************/
/*        Employee       */
/*************************/



export const getEmployees = () => api.get(url.EMPLOYEES+'/employees');

export const createUpdateEmployee = data => api.create(url.EMPLOYEES,data);

export const deleteEmployee = (use_id) => api.delete(url.EMPLOYEES + "/" + use_id);




/*************************/
/*        Salary       */
/*************************/

export const getSalary = year => api.get(url.SALARY+'/'+year);

export const createUpdateSalary = data => api.create(url.SALARY,data);

export const deleteSalary= sal_id => api.delete(url.SALARY + "/delete/" + sal_id);




/*************************/
/*        Achat       */
/*************************/

export const getAchat = () => api.get(url.ACHAT);

export const createUpdateAchat = data => api.create(url.ACHAT,data);

export const deleteAchat= ach_id => api.delete(url.ACHAT + "/delete/" + ach_id);
// get achat bank and link by transaction
export const getAchatLinkTransaction = tba_id => api.get(url.ACHAT+'/transaction/'+tba_id);
// update transaction bank link to achat
export const linkTransToAchat = data => api.create(url.TRANSACTION_BANK+'/achat',data);
// update match amount bank link to achat
export const updateMatchAmount = data => api.create(url.TRANSACTION_BANK+'/amountMatch',data);



/*************************/
/*       Recurrence       */
/*************************/

export const getRecurrences = () => api.get(url.RECURRENCE);

export const addRecurrence = data => api.create(url.RECURRENCE, data);

export const deleteRecurrence = id => api.delete(url.RECURRENCE + "/" +id);

export const getRecurrenceOfEntity = ent_id => api.get(url.RECURRENCE + "/" +ent_id);


/*************************/
/*          Export       */
/*************************/

export const dowloadExport = (data) => api.get(url.EXPORT, data);



/*************************/
/*      Bank Account     */
/*************************/


export const getListBank = () => api.get(url.LIST_BANK)

export const getAccountsBankUser = () => api.get(url.BANK_ACCOUNT)

export const insertBankAccount = (data) => api.create(url.BANK_ACCOUNT,data);

export const getAccountBank = () => api.get(url.BANK_ACCOUNT+"/link");

export const insertAccountLinkToBank = (data) =>api.create(url.BANK_ACCOUNT+"/link",data);


/*************************/
/*          Alert        */
/*************************/

export const handleAlert = (data) => api.create(url.ALERT, data);

export const getAlert = () => api.get(url.ALERT);

export const deleteAlert = (id) => api.delete(url.ALERT + "/" + id);

/*************************/
/*          User         */
/*************************/

export const getUser = () => api.get(url.ADMIN_USER);

export const deleteUser = (id) => api.delete(url.ADMIN_USER + "/" + id);

export const createOrUpdateUser = (data) => api.create(url.ADMIN_USER, data);

export const createOrUpdateUserAdmin = (data) => api.create(url.ADMIN_USER_CREATE, data);


/*************************/
/*        report         */
/*************************/

export const getReportData = (data) => api.get(url.REPORT, data);


