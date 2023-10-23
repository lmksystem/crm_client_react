import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useSelector } from "react-redux";

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
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
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      if (false) {
        setUserName(
          process.env.REACT_APP_DEFAULTAUTH === "fake"
            ? obj.username === undefined
              ? user.first_name
                ? user.first_name
                : obj.data.first_name
              : "Admin" || "Admin"
            : process.env.REACT_APP_DEFAULTAUTH === "firebase"
            ? obj.providerData[0].email
            : "Admin"
        );
      }
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
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            {userProfile?.logo ? (
              <img
                className="rounded-circle header-profile-user"
                src={avatar1}
                alt="Header Avatar"
              />
            ) : (
              <i className="mdi mdi-account-circle text-muted fs-20 align-middle me-1"></i>
            )}

            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userProfile?.use_firstname}
              </span>
              <span className="d-none d-xl-block ms-1 fs-13 text-muted user-name-sub-text">
                {ExtractTypeUser()}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">
            Bienvenue {userProfile?.use_firstname} !
          </h6>
          {userProfile.use_rank == 1 && (
            <DropdownItem className="p-0">
              <span
                onClick={() => {
                  navigate("/profile");
                }}
                className="dropdown-item"
              >
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
              className="dropdown-item"
            >
              <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle" data-key="t-logout">
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
