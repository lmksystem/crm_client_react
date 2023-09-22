import React from "react";
import { Navigate } from "react-router-dom";

// Mes import 
import Contacts from "../Views/Contacts/index";
import Collaborateurs from "../Views/Collaborateurs";
import DashboardEcommerce from "../Views/DashboardEcommerce";
import DashboardMain from "../Views/DashboardMain";
import GestionParameter from "../Views/GestionParameter";
import Products from "../Views/Product";

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
import Register from "../Views/Authentication/Register";
import TransactionList from "../Views/Reglements/TransactionList";
import Employees from "../Views/Employees";
import Salary from "../Views/Salary";
import TransactionBank from "../Views/Transaction";
import Achats from "../Views/Achat";
import BankAccount from "../Views/BankAccount";

// import PdfPreview from "../Views/Pdf";


const authProtectedRoutes = [
  // MES ROUTE QUE JE GARDE
  { path: "/contacts", component: <Contacts /> },
  { path: "/client-fournisseur", component: <Collaborateurs /> },
  { path: "/gestion/parametre", component: <GestionParameter /> },
  { path: "/produits", component: <Products /> },
  { path: "/dashboard", component: <DashboardMain /> },
  { path: "/index", component: <DashboardEcommerce /> },

  // //Invoices
  { path: "/factures/liste", component: <InvoiceList /> },
  { path: "/factures/detail/:id", component: <InvoiceDetails /> },
  { path: "/factures/creation", component: <InvoiceCreate /> },

  // Devis
  { path: "/devis/liste", component: <DevisList /> },
  { path: "/devis/detail/:id", component: <DevisDetails /> },
  { path: "/devis/creation", component: <DevisCreate /> },
  { path: "/devis/edition/:id", component: <DevisCreate /> },

  // Réglement - Transaction
  { path: "/transaction/liste", component: <TransactionList /> },

  // Employees
  { path: "/employees", component: <Employees /> },
  { path: "/salary", component: <Salary /> },

  // Banque / Achat

  { path: "/transaction/bank", component: <TransactionBank /> },
  { path: "/achat", component: <Achats /> },
  { path:'/bankaccount',component :<BankAccount/>},
  

  

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

];

export { authProtectedRoutes, publicRoutes };



// page contact http://localhost:3000/apps-crm-contacts#
