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

//Devis
import DevisReducer from "./devis/reducer";

//exportReducer
import ExportReducer from "./export/reducer";

//BankAccounReducer
import BankAccountReducer from "./bankAccount/reducer";

//AdminReducer
import AdminReducer from "./admin/reducer";

//ReportReducer

//EmailReducer
import EmailReducer from "./email/reducer";

const appReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  ForgetPassword: ForgetPasswordReducer,
  Gestion: GestionReducer,
  Company: CompanyReducer,
  Devis: DevisReducer,
  Employee: EmployeeReducer,
  Export: ExportReducer,
  BankAccount: BankAccountReducer,
  Admin: AdminReducer,
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
