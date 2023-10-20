import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useDispatch } from "react-redux";

import moment from 'moment';
moment.locale('fr')

const DashboardAdmin = () => {
  document.title = "Accueil admin | Countano";

  const dispatch = useDispatch();
  console.log('admin');
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Tableau de bord" pageTitle="Countano" />
          <Row>
            <Col>
              {/* <div className="h-100">
                <Section perdiodeCalendar={perdiodeCalendar}  setPeriodeCalendar={setPeriodeCalendar}/>
                <Row>
                  <Widget perdiodeCalendar={perdiodeCalendar}/>
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

export default DashboardAdmin;
