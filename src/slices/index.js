import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";

import ForgetPasswordReducer from "./auth/forgetpwd/reducer";

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
  Product: ProductReducer,
  Invoice: InvoiceReducer,
  Gestion: GestionReducer,
  Company: CompanyReducer,
  Devis: DevisReducer,
  Transaction: TransactionReducer,
  TransactionBank: TransactionBankReducer,
  Employee: EmployeeReducer,
  Salary: SalaryReducer,
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
    localStorage.removeItem("authUser");
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
