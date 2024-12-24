import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";

import ForgetPasswordReducer from "./auth/forgetpwd/reducer";

// Company
import CompanyReducer from "./company/reducer";

//BankAccounReducer
import BankAccountReducer from "./bankAccount/reducer";

//AdminReducer
import AdminReducer from "./admin/reducer";

const appReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  ForgetPassword: ForgetPasswordReducer,
  Company: CompanyReducer,
  BankAccount: BankAccountReducer,
  Admin: AdminReducer
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
