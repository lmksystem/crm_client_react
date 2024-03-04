import { useEffect, useState } from "react";
import { getLoggedinUser } from "../../helpers/api_helper";

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  let token = userProfileSession && userProfileSession["token"];
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  const [userProfile, setUserProfile] = useState(userProfileSession ? userProfileSession : null);
 // console.log(token);
  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    let token = userProfileSession && userProfileSession["token"];
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(token ? false : true);
  }, []);


  // console.log("userProfile",userProfile);

  return { userProfile, loading, token };
};

export { useProfile };