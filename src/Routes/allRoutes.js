import React from "react";
import { Navigate } from "react-router-dom";

// Mes import
import DashboardMain from "../Views/DashboardMain";

//Invoices
import InvoiceList from "../Views/Invoices/InvoiceList";
import InvoiceDetails from "../Views/Invoices/InvoiceDetails";

//Devis
import DevisList from "../Views/Devis/DevisList";
import DevisDetails from "../Views/Devis/DevisDetails";

//AUTHENTIFICATION
import Login from "../Views/Authentication/Login";
import Logout from "../Views/Authentication/Logout";
import ForgetPasswordPage from "../Views/Authentication/ForgetPassword";
import FinalisationAccount from "../Views/FinalisationAccount/FinalisationAccount";
import Basic404 from "../Views/AuthenticationInner/Errors/Basic404";

import ResertPassword from "../Views/Authentication/ResertPassword";
import TransactionList from "../Views/Reglements/TransactionList";
import Domaines from "../Views/Domaine/domaine";

// import PdfPreview from "../Views/Pdf";

const userRoute = [
  // MES ROUTE QUE JE GARDE

  { id: 6, path: "/dashboard", component: <DashboardMain />, rank: 0 },

  // Facture
  { id: 7, path: "/factures/liste", component: <InvoiceList />, rank: 0 },
  { id: 8, path: "/factures/detail/:id", component: <InvoiceDetails />, rank: 0 },

  // Devis
  { id: 10, path: "/devis/liste", component: <DevisList />, rank: 0 },
  { id: 11, path: "/devis/detail/:id", component: <DevisDetails />, rank: 0 },

  { id: 13, path: "/transaction/liste", component: <TransactionList />, rank: 0 },
  { id: 14, path: "/domaine/liste", component: <Domaines />, rank: 0 }
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/reset-password/:token", component: <ResertPassword /> },
  { path: "/finalisation-compte", component: <FinalisationAccount /> },
  { path: "*", component: <Basic404 /> }
];

export { userRoute, publicRoutes };
