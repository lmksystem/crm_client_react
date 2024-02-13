import React from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
} from "reactstrap";

import * as moment from "moment";
import CountUp from "react-countup";

//Import Icons
import FeatherIcon from "feather-icons-react";

import 'react-toastify/dist/ReactToastify.css';

import 'moment/locale/fr'  // without this line it didn't work
import { useSelector } from "react-redux";

moment.locale('fr')

const WidgetCountUp = ({ data, type, xl = 3, md = 6 }) => {
  const { devise } = useSelector((state) => ({
    devise: state?.Company?.devise,
  }));

  return (
    <React.Fragment>
      <Col xl={xl} md={md}>
        <Card className="card-animate" >
          <CardBody >
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p style={{ color:"#ff9f00" }}  className="text-uppercase fw-medium  mb-0">
                  {type} {data.name}
                </p>
              </div>
              <div className="flex-shrink-0">
                <h5
                  className={"fs-14 mb-0 text-" /*+ invoicewidget.percentageClass*/}
                >
                  {/* <i className="ri-arrow-right-up-line fs-13 align-middle"></i>{" "} */}
                  {/* {invoicewidget.percentage} */}
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between mt-4">
              <div>
                <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                  <CountUp
                    start={0}
                    suffix={devise}
                    decimals="2"
                    end={data.total}
                    duration={1}
                    className="counter-value"
                    separator={" "}
                    decimal={","}
                  />
                </h4>
                <span className="badge bg-warning me-1">
                  {data.nb}
                </span>{" "}
                <span className="text-muted">
                  {" "}
                  {data.text}
                </span>
              </div>
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-light rounded fs-3">
                  <FeatherIcon
                    icon={data.icon}
                    className="text-success icon-dual-success"
                  />
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>

  );
};

export default WidgetCountUp;