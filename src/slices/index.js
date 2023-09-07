import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

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

// API Key
import APIKeyReducer from "./apiKey/reducer";

// Mes reducer

// Gestion 
import GestionReducer from "./gestion/reducer";

// Company 
import CompanyReducer from "./company/reducer";

// Company 
import ProductReducer from "./product/reducer";

//Invoice
import InvoiceReducer from "./invoice/reducer";

//Devis
import DevisReducer from "./devis/reducer";

//Devis
import TransactionReducer from "./transaction/reducer";

import sessionStorage from "redux-persist/es/storage/session";

const appReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  Profile: ProfileReducer,
  DashboardAnalytics: DashboardAnalyticsReducer,
  DashboardCRM: DashboardCRMReducer,
  DashboardEcommerce: DashboardEcommerceReducer,
  DashboardCrypto: DashboardCryptoReducer,
  DashboardProject: DashboardProjectReducer,
  DashboardNFT: DashboardNFTReducer,
  APIKey: APIKeyReducer,
  Product: ProductReducer,
  Invoice: InvoiceReducer,
  Gestion: GestionReducer,
  Company: CompanyReducer,
  Devis: DevisReducer,
  Transaction: TransactionReducer,
});

const rootReducer = (state, action) => {
 
  if (action.type === 'login/logoutUserSuccess') {
    console.log("logout");
    sessionStorage.removeItem('authUser')
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export default rootReducer;