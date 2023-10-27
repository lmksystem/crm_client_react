import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { useProfile } from "../Hooks/UserHooks";
import { getAccountBank as onGetAccountBank } from "../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import * as moment from "moment";
import FluidText from "./FluidText";
import { getLoggedinUser } from "../../helpers/api_helper";

const BreadCrumb = ({ title, pageTitle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listAccountsBank } = useSelector((state) => ({
    listAccountsBank: state.BankAccount.listAccountsBank,
  }));
  const userProfile = getLoggedinUser();
  const[dateExpired,setDateExpired] = useState(null);

  function findClosestDateWithin15Days(dateArray=[]) {
    // Obtenez la date actuelle
    const currentDate = moment();
    let closestDate = null;
    let closestDifference = Infinity;
    for (const dateStr of dateArray) {
      const dateObj = moment(dateStr);
      const differenceInDays = currentDate.diff(dateObj, 'days');
      if (differenceInDays >= -15 && differenceInDays <= 0 && Math.abs(differenceInDays) < closestDifference) {
        closestDate = dateStr;
      }
    }
    setDateExpired(closestDate)
  }

  useEffect(() => {
    dispatch(onGetAccountBank()).then(()=>{
      if(listAccountsBank){
        let newArrayDate = listAccountsBank?.map((e)=> e.bac_date_expired) || [];
        findClosestDateWithin15Days(newArrayDate)
      }
    
    })
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            {/* <h4 className="mb-sm-0">{title}</h4> */}
            <FluidText title={title}/>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to="#">{pageTitle}</Link>
                </li>
                <li className="breadcrumb-item active">{title}</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
      { dateExpired!=null && <Col xs={12}>
          {userProfile.use_rank == 0 && (
            <div
              style={{
                color: "#721c24",
                backgroundColor: "#f8d7da",
                borderColor: "#f5c6cb",
              }}
              className="alert d-sm-flex align-items-center justify-content-between "
            >
              Veuillez mettre à jour vos comptes bancaires avant le {dateExpired}
              <button
                onClick={() => {
                  navigate("/bankaccount");
                }}
                type="button"
                class="btn btn-light my-3"
              >
                Accéder aux comptes
              </button>
            </div>
          )}
        </Col>}
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
