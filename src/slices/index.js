import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";

import ForgetPasswordReducer from "./auth/forgetpwd/reducer";

// Dashboard Analytics
import DashboardAnalyticsReducer from "./dashboardAnalytics/reducer";

// Dashboard CRM
import DashboardCRMReducer from "./dashboardCRM/reducer";

// Dashboard Ecommerce
import DashboardEcommerceReducer from "./dashboardEcommerce/reducer";

// Dashboard Cryto
import DashboardCryptoReducer from "./dashboardCrypto/reducer";

// Dashboard Cryto
import DashboardProjectReducer from "./dashboardProject/reducer";

// Dashboard NFT
import DashboardNFTReducer from "./dashboardNFT/reducer";

// Mes reducer

// Employee
import EmployeeReducer from "./employee/reducer";

// Gestion
import GestionReducer from "./gestion/reducer";

// Company
import CompanyReducer from "./company/reducer";

// Product
import ProductReducer from "./product/reducer";

//Invoice
import InvoiceReducer from "./invoice/reducer";

//Devis
import DevisReducer from "./devis/reducer";

//Transaction
import TransactionReducer from "./transaction/reducer";

//TransactionBank
import TransactionBankReducer from "./transactionBank/reducer";

//Salary
import SalaryReducer from "./salary/reducer";

//Achat
import AchatReducer from "./achat/reducer";

//Recurrence
import RecurrenceReducer from "./recurrence/reducer";

//exportReducer
import ExportReducer from "./export/reducer";

//BankAccounReducer
import BankAccountReducer from "./bankAccount/reducer";

//AdminReducer
import AdminReducer from "./admin/reducer";

//ReportReducer
import ReportReducer from "./report/reducer";

//EmailReducer
import EmailReducer from "./email/reducer";

import sessionStorage from "redux-persist/es/storage/session";

const appReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  ForgetPassword: ForgetPasswordReducer,
  DashboardAnalytics: DashboardAnalyticsReducer,
  DashboardCRM: DashboardCRMReducer,
  DashboardEcommerce: DashboardEcommerceReducer,
  DashboardCrypto: DashboardCryptoReducer,
  DashboardProject: DashboardProjectReducer,
  DashboardNFT: DashboardNFTReducer,
  Product: ProductReducer,
  Invoice: InvoiceReducer,
  Gestion: GestionReducer,
  Company: CompanyReducer,
  Devis: DevisReducer,
  Transaction: TransactionReducer,
  TransactionBank: TransactionBankReducer,
  Employee: EmployeeReducer,
  Salary: SalaryReducer,
  Achat: AchatReducer,
  Recurrence: RecurrenceReducer,
  Export: ExportReducer,
  BankAccount: BankAccountReducer,
  Admin: AdminReducer,
  Report: ReportReducer,
  Email: EmailReducer
});

const rootReducer = (state, action) => {
  if (action.type === "login/logoutUserSuccess") {
    console.log("logout");
    sessionStorage.removeItem("authUser");
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
