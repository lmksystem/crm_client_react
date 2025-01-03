import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
// import Widget from "./Widgets";
// import Revenue from "./Revenue";
// import { getDevisPeriodCount as onGetDevisPeriodCount, getTransactionPricePeriode as onGetTransactionPricePeriode, getEntityPeriodCount as onGetEntityPeriodCount, getTransactionByMonth as onGetTransactionByMonth, getDevisByMonth as onGetDevisByMonth, getCompany as onGetCompany } from "../../slices/thunks";
import { useDispatch } from "react-redux";
// import Section from "./Section";
import moment from "moment";

moment.locale("fr");

const DashboardMain = () => {
  document.title = "Accueil | CRM LMK";

  // const dispatch = useDispatch();

  const [perdiodeCalendar, setPeriodeCalendar] = useState({
    start: moment().startOf("year"),
    end: moment()
  });

  useEffect(() => {
    // dispatch(onGetCompany());
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Tableau de bord"
            pageTitle="CRM LMK"
          />
          <Row>
            <Col>
              {/* <div className="h-100">
                <Section
                  perdiodeCalendar={{ start: moment(perdiodeCalendar.start).format("DD MMM YYYY"), end: moment(perdiodeCalendar.end).format("DD MMM YYYY") }}
                  setPeriodeCalendar={setPeriodeCalendar}
                />
                <Row>
                  <Widget perdiodeCalendar={perdiodeCalendar} />
                </Row>
                <Row>
                  <Col>
                    <Revenue perdiodeCalendar={perdiodeCalendar} />
                  </Col>
                </Row>
              </div> */}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardMain;
