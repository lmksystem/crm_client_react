import React, { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

//import images

import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../Hooks/UserHooks";

import { createOrUpdateUser as onCreateOrUpdateUser } from "../../slices/thunks";
import { useDispatch } from "react-redux";
import { updateUser } from "../../helpers/backend_helper";
import { updateLoggedUser } from "../../helpers/api_helper";

const CompanyDropdown = ({ companyList }) => {
  const { userProfile } = useProfile();
  const [selectedCompany, setSelectedCompany] = useState("");

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const handleChangeCompany = (data) => {
    updateUser(data).then((res) => {
      updateLoggedUser(res.data);
      window.location.reload();
    });
  };

  useEffect(() => {
    let company = companyList.find((data) => data.com_id == userProfile.use_com_fk);
    if (company) {
      setSelectedCompany(() => company);
    }
  }, [companyList]);

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
              <span className="d-none d-xl-block ms-1 fs-13 text-muted user-name-sub-text">Entreprise</span>
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{selectedCompany?.com_name}</span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {companyList?.map((data, i) => {
            return (
              <DropdownItem
                key={i}
                className="p-0">
                <Button
                  onClick={() => handleChangeCompany({ use_id: userProfile.use_id, use_com_fk: data.com_id })}
                  className="dropdown-item">
                  {data.com_name}
                </Button>
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default CompanyDropdown;
