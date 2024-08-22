import axios from "axios";
import { postLogin } from "../../../helpers/backend_helper";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from "./reducer";

export const loginUser = (user, history) => async (dispatch) => {
  try {
    let data = await postLogin({
      email: user.email,
      password: user.password
    });

    if (data.user) {
      localStorage.setItem("authUser", JSON.stringify(data.user));
      dispatch(loginSuccess(data.user));
    } else {
      dispatch(apiError(data.error));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    localStorage.removeItem("authUser");
    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const getCompanyAndModule = async (com_id) => {
  let res = await axios.get("/v1/admin/company/" + com_id);
  return res;
};
