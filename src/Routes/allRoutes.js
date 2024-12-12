import React from "react";
import { Navigate } from "react-router-dom";

// Mes import
import DashboardMain from "../Views/DashboardMain";

//Invoices
import InvoiceList from "../Views/Invoices/InvoiceList";
import InvoiceCreate from "../Views/Invoices/InvoiceCreate";
import InvoiceDetails from "../Views/Invoices/InvoiceDetails";

//Devis
import DevisList from "../Views/Devis/DevisList";
import DevisCreate from "../Views/Devis/DevisCreate";
import DevisDetails from "../Views/Devis/DevisDetails";

//AUTHENTIFICATION
import Login from "../Views/Authentication/Login";
import Logout from "../Views/Authentication/Logout";
import ForgetPasswordPage from "../Views/Authentication/ForgetPassword";

import FinalisationAccount from "../Views/FinalisationAccount/FinalisationAccount";
import Basic404 from "../Views/AuthenticationInner/Errors/Basic404";
import CreateAccount from "../Views/AuthenticationInner/Register/CreateAccount";
import ResertPassword from "../Views/Authentication/ResertPassword";

// import PdfPreview from "../Views/Pdf";

const userRoute = [
  // MES ROUTE QUE JE GARDE

  { id: 6, path: "/dashboard", component: <DashboardMain />, rank: 0 },

  // Facture
  { id: 7, path: "/factures/liste", component: <InvoiceList />, rank: 0 },
  { id: 8, path: "/factures/detail/:id", component: <InvoiceDetails />, rank: 0 },
  { id: 9, path: "/factures/creation", component: <InvoiceCreate />, rank: 0 },

  // Devis
  { id: 10, path: "/devis/liste", component: <DevisList />, rank: 0 },
  { id: 11, path: "/devis/detail/:id", component: <DevisDetails />, rank: 0 },
  { id: 12, path: "/devis/creation", component: <DevisCreate />, rank: 0 },
  { id: 13, path: "/devis/edition/:id", component: <DevisCreate />, rank: 0 }
];

// const testArrayOffert = "['/contacts', '/client-fournisseur', '/client-fournisseur/detail', '/gestion/parametre', '/produits', '/dashboard', '/factures/liste', '/factures/detail/:id', '/factures/creation', '/devis/liste', '/devis/detail/:id', '/devis/creation', '/devis/edition/:id', '/recurrence', '/transaction/liste', '/employees', '/salary', '/transaction/bank', '/achat', '/bankaccount', '/rapports', '/export', '/company/profile', '/']";

const adminRoute = [
  // { path: "/admin", component: <DashboardAdmin />, rank: 1 },
  // { path: "/admin/users", component: <UserAdmin />, rank: 1 },
  // { path: "/admin/user/", component: <FormUser />, rank: 1 },
  // { path: "/profile", component: <Profile />, rank: 1 },
  // { path: "/admin/entreprises", component: <EntrepriseAdmin />, rank: 1 },
  // { path: "/admin/entreprise/:id", component: <FormCompany />, rank: 1 },
  // {
  //   path: "/",
  //   exact: true,
  //   component: <Navigate to="/admin" />,
  //   rank: 1
  // }
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/reset-password/:token", component: <ResertPassword /> },
  { path: "/inscription", component: <CreateAccount /> },
  { path: "/finalisation-compte", component: <FinalisationAccount /> },
  { path: "*", component: <Basic404 /> }
];

export { userRoute, adminRoute, publicRoutes };
