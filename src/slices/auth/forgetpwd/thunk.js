import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

import {
  postFakeForgetPwd,
  postJwtForgetPwd,
} from "../../../helpers/fakebackend_helper";
import { ForgetPassword } from "../../../helpers/backend_helper";
import { toast } from "react-toastify";

const fireBaseBackend = getFirebaseBackend();

export const userForgetPassword = (user, history) => async (dispatch) => {
  try {

    const data = await ForgetPassword(user)

    if (data) {
      toast.success("Un lien vous à été envoyer à votre adresse email.")
    }
  } catch (forgetError) {
    toast.error("Un lien vous à été envoyer à votre adresse email.");
  }
}