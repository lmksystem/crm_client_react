import React, { useEffect, useState } from "react";
import { Navigate, Route, useNavigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../slices/auth/login/thunk";


const AdminProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();
  const [hasRank, setHasRank] = useState(null)

  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */
  if (!userProfile && loading && !token) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }


  /*
    Navigate is un-auth access protected routes via url
    */
    if (userProfile.use_rank == 0) {
      return (
        <Navigate to={{ pathname: "/dashboard", state: { from: props.location } }} />
      );
    }

  return <>{props.children}</>;

};



export { AdminProtected };