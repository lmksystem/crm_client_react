import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Widget from "./Widgets";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import Section from "./Section";

const DashboardMain = () => {
  document.title = "Accueil | Countano";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };
  



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Tableau de bord" pageTitle="Coutano" />
          <Row>
            <Col>
              <div className="h-100">
                <Section />
                <Row>
                  <Widget />
                </Row>
                <Row>
                  <Col>
                    <Revenue />
                  </Col>
                  {/* <SalesByLocations /> */}
                </Row>
                {/* <Row>
                  <BestSellingProducts />
                  <TopSellers />
                </Row>
                <Row>
                  <StoreVisits />
                  <RecentOrders />
                </Row> */}
              </div>
            </Col>
            {/* <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardMain;
