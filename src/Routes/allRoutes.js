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
import Register from "../Views/Authentication/Register";
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


// import PdfPreview from "../Views/Pdf";


const userRoute = [
  // MES ROUTE QUE JE GARDE
  { path: "/contacts", component: <Contacts />, rank: 0 },
  { path: "/client-fournisseur", component: <Collaborateurs />, rank: 0 },
  { path: "/gestion/parametre", component: <GestionParameter />, rank: 0 },
  { path: "/produits", component: <Products />, rank: 0 },
  { path: "/dashboard", component: <DashboardMain />, rank: 0 },



  // //Invoices
  { path: "/factures/liste", component: <InvoiceList />, rank: 0 },
  { path: "/factures/detail/:id", component: <InvoiceDetails />, rank: 0 },
  { path: "/factures/creation", component: <InvoiceCreate />, rank: 0 },

  // Devis
  { path: "/devis/liste", component: <DevisList />, rank: 0 },
  { path: "/devis/detail/:id", component: <DevisDetails />, rank: 0 },
  { path: "/devis/creation", component: <DevisCreate />, rank: 0 },
  { path: "/devis/edition/:id", component: <DevisCreate />, rank: 0 },

  // Réglement - Transaction
  { path: "/transaction/liste", component: <TransactionList />, rank: 0 },

  // Employees
  { path: "/employees", component: <Employees />, rank: 0 },
  { path: "/salary", component: <Salary />, rank: 0 },

  // Banque / Achat

  { path: "/transaction/bank", component: <TransactionBank />, rank: 0 },
  { path: "/achat", component: <Achats />, rank: 0 },
  { path: '/bankaccount', component: <BankAccount />, rank: 0 },

  // Recurrence 
  { path: "/recurrence", component: <Recurrence />, rank: 0 },
  
  // Rapport 
  { path: "/rapports", component: <Reports />, rank: 0 },

  // comptability 
  { path: "/export", component: <Export />, rank: 0 },



  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
    rank: 0
  },
];

const adminRoute = [
  { path: "/admin", component: <DashboardAdmin />, rank: 1 },

  { path: "/admin/users", component: <UserAdmin />, rank: 1 },
  
  { path: "/admin/user/", component: <FormUser />, rank: 1 },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/admin" />,
    rank: 1
  },

  { path: "/profile", component: <Profile />, rank: 1 },

]


const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  { path: "/finalisation-compte", component: <FinalisationAccount /> },
  { path: "/erreur-404", component: <Basic404 /> },

];

export { userRoute, adminRoute, publicRoutes };



// page contact http://localhost:3000/apps-crm-contacts#
