import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Dropdown, DropdownMenu, DropdownToggle, Form } from "reactstrap";

//import images

import logoDark from "../assets/images/logo_lmk.png";
import logoLight from "../assets/images/logo_lmk.png";

//import Components
import SearchOption from "../Components/Common/SearchOption";

import FullScreenDropdown from "../Components/Common/FullScreenDropdown";
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import LightDark from "../Components/Common/LightDark";

import { changeSidebarVisibility, getCompanyListAction } from "../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { useProfile } from "../Components/Hooks/UserHooks";
import { getLoggedinUser } from "../helpers/api_helper";
import { useExpanded } from "react-table";
import CompanyDropdown from "../Components/Common/CompanyDropdown";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const dispatch = useDispatch();
  const userProfile = getLoggedinUser();

  const { sidebarVisibilitytype } = useSelector((state) => ({
    sidebarVisibilitytype: state.Layout.sidebarVisibilitytype
  }));

  const [search, setSearch] = useState(false);
  const [companyList, setCompanyList] = useState([]);

  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;
    dispatch(changeSidebarVisibility("show"));

    if (windowSize > 767) document.querySelector(".hamburger-icon").classList.toggle("open");

    //For collapse horizontal menu
    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
    }

    //For collapse vertical and semibox menu
    if (sidebarVisibilitytype === "show" && (document.documentElement.getAttribute("data-layout") === "vertical" || document.documentElement.getAttribute("data-layout") === "semibox")) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "sm" ? document.documentElement.setAttribute("data-sidebar-size", "") : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "lg" ? document.documentElement.setAttribute("data-sidebar-size", "sm") : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }

    //Two column menu
    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.contains("twocolumn-panel") ? document.body.classList.remove("twocolumn-panel") : document.body.classList.add("twocolumn-panel");
    }
  };

  useEffect(() => {
    getCompanyListAction().then((res) => {
      setCompanyList(res);
    });
  }, []);

  return (
    <React.Fragment>
      <header
        id="page-topbar"
        className={headerClass}>
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box horizontal-logo">
                <Link
                  to="/"
                  className="logo logo-dark">
                  <span className="logo-lg">
                    <img
                      src={logoDark}
                      alt=""
                      height="25"
                    />
                  </span>
                </Link>

                <Link
                  to="/"
                  className="logo logo-light">
                  <span className="logo-lg">
                    <img
                      src={logoLight}
                      alt=""
                      height="25"
                    />
                  </span>
                </Link>
              </div>

              <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                id="topnav-hamburger-icon">
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>

              {userProfile?.use_rank === 0 && <SearchOption />}
            </div>

            <div className="d-flex align-items-center">
              <Dropdown
                isOpen={search}
                toggle={toogleSearch}
                className="d-md-none topbar-head-dropdown header-item">
                <DropdownToggle
                  type="button"
                  tag="button"
                  className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                  <i className="bx bx-search fs-22"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                  <Form className="p-3">
                    <div className="form-group m-0">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search ..."
                          aria-label="Recipient's username"
                        />
                        <button
                          className="btn btn-secondary"
                          type="submit">
                          <i className="mdi mdi-magnify"></i>
                        </button>
                      </div>
                    </div>
                  </Form>
                </DropdownMenu>
              </Dropdown>

              {/* CompanyDropdown */}
              <CompanyDropdown companyList={companyList} />

              {/* FullScreenDropdown */}
              <FullScreenDropdown />

              {/* Dark/Light Mode set */}
              <LightDark
                layoutMode={layoutModeType}
                onChangeLayoutMode={onChangeLayoutMode}
              />

              {/* ProfileDropdown */}
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
