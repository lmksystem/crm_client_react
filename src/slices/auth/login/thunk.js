//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

const fireBaseBackend = getFirebaseBackend();

export const loginUser = (user, history) => async (dispatch) => {

  try {

    let data = await postLogin({
      email: user.email,
      password: user.password,
    });;

    if (data.user) {
      sessionStorage.setItem("authUser", JSON.stringify(data.user));
      dispatch(loginSuccess(data.user));
      history('/dashboard')
    } else {
      dispatch(apiError(data.error));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem('authUser')
    dispatch(logoutUserSuccess(true));

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (data, history, type) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(data, type);
    } else {
      response = postSocialLogin(data);
    }

    const socialdata = await response;

    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }

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