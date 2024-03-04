import { ForgetPassword } from "../../../helpers/backend_helper";
import { toast } from "react-toastify";

export const userForgetPassword = (user, history) => async (dispatch) => {
  try {
    const data = await ForgetPassword(user);

    if (data) {
      toast.success("Un lien vous à été envoyer à votre adresse email.");
    }
  } catch (forgetError) {
    toast.error("Ce compte n'existe pas");
  }
};
