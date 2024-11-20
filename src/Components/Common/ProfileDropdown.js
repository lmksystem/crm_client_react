import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

//import images

import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../Hooks/UserHooks";

const ProfileDropdown = () => {
  const { userProfile } = useProfile();
  const [userName, setUserName] = useState("Admin");
  const navigate = useNavigate();

  function ExtractTypeUser() {
    let typeRank;
    switch (userProfile.use_rank) {
      case 1:
        typeRank = "Admin";
        break;
      case 2:
        typeRank = "Employé";
        break;
      default:
        typeRank = "Utilisateur";
        break;
    }
    return typeRank;
  }

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
    }
  }, [userName]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user">
        <DropdownToggle
          tag="button"
          type="button"
          className="btn">
          <span className="d-flex align-items-center">
            {userProfile?.logo ? (
              <>
                {/* <img
                  className="rounded-circle header-profile-user"
                  src={"avatar1"}
                  alt="Header Avatar"
                /> */}
              </>
            ) : (
              <i className="mdi mdi-account-circle text-muted fs-20 align-middle me-1"></i>
            )}

            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userProfile?.use_firstname}</span>
              <span className="d-none d-xl-block ms-1 fs-13 text-muted user-name-sub-text">{ExtractTypeUser()}</span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Bienvenue {userProfile?.use_firstname} !</h6>
          {userProfile.use_rank != 2 && (
            <DropdownItem className="p-0">
              <span
                onClick={() => {
                  if (userProfile.use_rank == 0) {
                    navigate("/company/profile");
                  } else if (userProfile.use_rank == 1) {
                    navigate("/profile");
                  }
                }}
                className="dropdown-item">
                <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                <span className="align-middle">Profil</span>
              </span>
            </DropdownItem>
          )}
          {/*          
          <DropdownItem className='p-0'>
            <Link to={process.env.PUBLIC_URL + "/auth-lockscreen-basic"} className="dropdown-item">
              <i
                className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span>
            </Link>
          </DropdownItem> */}
          <DropdownItem className="p-0">
            <Link
              to={process.env.PUBLIC_URL + "/logout"}
              className="dropdown-item">
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
              <span
                className="align-middle"
                data-key="t-logout">
                Se déconnecter
              </span>
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
