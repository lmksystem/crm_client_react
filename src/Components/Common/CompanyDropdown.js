import React, { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { useProfile } from "../Hooks/UserHooks";
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
    let company = companyList.find((data) => data.com_id == userProfile.ent_com_fk);
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
            <i className="mdi mdi-account-circle text-muted fs-20 align-middle me-1"></i>

            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-block ms-1 fs-13 text-muted user-name-sub-text">Entreprise</span>
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{selectedCompany?.com_name}</span>
            </span>
          </span>
        </DropdownToggle>
       
      </Dropdown>
    </React.Fragment>
  );
};

export default CompanyDropdown;
