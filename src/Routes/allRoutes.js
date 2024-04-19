import React from "react";
import { Navigate } from "react-router-dom";

// Mes import
import Contacts from "../Views/Contacts/index";
import Collaborateurs from "../Views/Collaborateurs";
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
import TransactionList from "../Views/Reglements/TransactionList";
import Employees from "../Views/Employees";
import Salary from "../Views/Salary";
import TransactionBank from "../Views/Transaction";
import Achats from "../Views/Achat";
import BankAccount from "../Views/BankAccount";
import Recurrence from "../Views/Recurrence";
import Export from "../Views/Export";
import DashboardAdmin from "../Views/Admin/DashboardAdmin";
import UserAdmin from "../Views/Admin/User";
import FormUser from "../Views/Admin/User/FormUser";
import FinalisationAccount from "../Views/FinalisationAccount/FinalisationAccount";
import Basic404 from "../Views/AuthenticationInner/Errors/Basic404";
import Reports from "../Views/reports";
import Profile from "../Views/Admin/User/Profile";
import CompanyProfil from "../Views/Company";
import CollaboDetails from "../Views/Collaborateurs/CollaboDetails";
import CreateAccount from "../Views/AuthenticationInner/Register/CreateAccount";
import ResertPassword from "../Views/Authentication/ResertPassword";
import EntrepriseAdmin from "../Views/Admin/company";
import FormCompany from "../Views/Admin/company/FormCompany";

// import PdfPreview from "../Views/Pdf";

const userRoute = [
  // MES ROUTE QUE JE GARDE
  { id: 1, path: "/contacts", component: <Contacts />, rank: 0 },
  { id: 2, path: "/client-fournisseur", component: <Collaborateurs />, rank: 0 },
  { id: 3, path: "/client-fournisseur/detail", component: <CollaboDetails />, rank: 0 },
  { id: 4, path: "/gestion/parametre", component: <GestionParameter />, rank: 0 },
  { id: 5, path: "/produits", component: <Products />, rank: 0 },
  { id: 6, path: "/dashboard", component: <DashboardMain />, rank: 0 },

  // Facture
  { id: 7, path: "/factures/liste", component: <InvoiceList />, rank: 0 },
  { id: 8, path: "/factures/detail/:id", component: <InvoiceDetails />, rank: 0 },
  { id: 9, path: "/factures/creation", component: <InvoiceCreate />, rank: 0 },

  // Devis
  { id: 10, path: "/devis/liste", component: <DevisList />, rank: 0 },
  { id: 11, path: "/devis/detail/:id", component: <DevisDetails />, rank: 0 },
  { id: 12, path: "/devis/creation", component: <DevisCreate />, rank: 0 },
  { id: 13, path: "/devis/edition/:id", component: <DevisCreate />, rank: 0 },
  // Recurrence
  { id: 14, path: "/recurrence", component: <Recurrence />, rank: 0 },

  // Réglement - Transaction
  { id: 15, path: "/transaction/liste", component: <TransactionList />, rank: 0 },

  // Employees
  { id: 16, path: "/employees", component: <Employees />, rank: 0 },
  { id: 17, path: "/salary", component: <Salary />, rank: 0 },

  // Banque / Achat

  { id: 17, path: "/transaction/bank", component: <TransactionBank />, rank: 0 },
  { id: 18, path: "/achat", component: <Achats />, rank: 0 },
  { id: 19, path: "/bankaccount", component: <BankAccount />, rank: 0 },

  // Rapport
  { id: 20, path: "/rapports", component: <Reports />, rank: 0 },

  // comptability
  { id: 21, path: "/export", component: <Export />, rank: 0 },

  { id: 22, path: "/company/profile", component: <CompanyProfil />, rank: 0 },

  { id: 23, path: "/", exact: true, component: <Navigate to="/dashboard" />, rank: 0 }
];

// const testArrayOffert = "['/contacts', '/client-fournisseur', '/client-fournisseur/detail', '/gestion/parametre', '/produits', '/dashboard', '/factures/liste', '/factures/detail/:id', '/factures/creation', '/devis/liste', '/devis/detail/:id', '/devis/creation', '/devis/edition/:id', '/recurrence', '/transaction/liste', '/employees', '/salary', '/transaction/bank', '/achat', '/bankaccount', '/rapports', '/export', '/company/profile', '/']";

const adminRoute = [
  { path: "/admin", component: <DashboardAdmin />, rank: 1 },

  { path: "/admin/users", component: <UserAdmin />, rank: 1 },

  { path: "/admin/user/", component: <FormUser />, rank: 1 },

  { path: "/profile", component: <Profile />, rank: 1 },

  { path: "/admin/entreprises", component: <EntrepriseAdmin />, rank: 1 },
  { path: "/admin/entreprise/:id", component: <FormCompany />, rank: 1 },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/admin" />,
    rank: 1
  }
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

// page contact http://localhost:3000/apps-crm-contacts#
