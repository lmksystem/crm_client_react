import React, { useEffect, useId, useState } from "react";
import { Button, Card, CardBody, Col, Container, Input, Row, UncontrolledTooltip } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import WidgetCountUp from "../../Components/Common/WidgetCountUp";
import ReactApexChart from "react-apexcharts";
import { getReportData as onGetReportData } from "../../slices/thunks";
import { Feather } from "feather-icons-react/build/IconComponents";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

moment.updateLocale("en");

const Reports = () => {
  document.title = "Rapports | Countano";

  const { report, devise } = useSelector((state) => ({
    report: state.Report.report,
    devise: state.Company.devise
  }));

  const dispatch = useDispatch();

  const [date, setDate] = useState(moment());

  let data = [
    {
      name: "Revenus",
      data: report?.revenus?.dataGraph || []
    },
    {
      name: "Dépenses",
      data: report?.charges?.dataGraph || []
    }
  ];

  const checkValue = (e) => {
    let value = e.target.value;
    if (/^[0-9]+$/.test(value)) {
      setDate(value);
    }
  };

  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#00A34C", "#FF9F00"],
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    },
    yaxis: {
      title: {
        text: ""
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " " + devise;
        }
      }
    }
  };

  useEffect(() => {
    if (date) {
      let date_start = moment(date).startOf("year");
      let date_end = moment(date).endOf("year");
      console.log(date_start.format("YYYY-MM-DD"), date_end.format("YYYY-MM-DD"));
      dispatch(onGetReportData({ date_start: date_start.format("YYYY-MM-DD"), date_end: date_end.format("YYYY-MM-DD") }));
    }
  }, [date.format("YYYY")]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Rapports"
            pageTitle="Countano"
          />
          <Row>
            <div className="d-flex mb-2 justify-content-end">
              <div
                className="input-group"
                style={{ width: "24em" }}>
                <button
                  onClick={() => {
                    setDate((date) => moment(date).add(-1, "year"));
                  }}
                  className="btn btn-soft-primary">
                  <FeatherIcon icon={"arrow-left"}></FeatherIcon>{" "}
                </button>
                <Input
                  className="form-control text-center"
                  value={date.format("YYYY")}
                  disabled
                  onChange={checkValue}
                  maxLength={4}
                  type="text"></Input>
                <button
                  onClick={() => {
                    setDate((date) => moment(date).add(1, "year"));
                  }}
                  className="btn btn-soft-primary">
                  <FeatherIcon icon={"arrow-right"}></FeatherIcon>
                </button>
              </div>
            </div>
            <Col lg={6}>
              <div
                style={{ position: "absolute", top: 5, right: 20, zIndex: 200 }}
                className="d-flex align-items-center justify-content-center">
                <a id={"ScheduleUpdateTooltip-1"}>
                  <i class="bx bx-info-circle fs-5 text-primary"></i>
                </a>
                <UncontrolledTooltip
                  placement="top"
                  target={"ScheduleUpdateTooltip-1"}
                  trigger="hover">
                  Le calcul des revenus est constitué des factures de ventes et des factures d'achats de type remboursement.
                </UncontrolledTooltip>
              </div>
              <WidgetCountUp
                xl={12}
                data={{ name: "Revenus Totaux", icon: "arrow-up-right", total: report?.revenus?.dataGraph.reduce((accumulator, currentValue) => accumulator + currentValue, 0), nb: report?.revenus?.nb_facture, text: "Ventes perçues" }}
                type={""}
              />
            </Col>
            <Col lg={6}>
              <div
                style={{ position: "absolute", top: 5, right: 20, zIndex: 200 }}
                className="d-flex align-items-center justify-content-center">
                <a id={"ScheduleUpdateTooltip-2"}>
                  <i class="bx bx-info-circle fs-5 text-primary"></i>
                </a>
                <UncontrolledTooltip
                  placement="top"
                  target={"ScheduleUpdateTooltip-2"}
                  trigger="hover">
                  Le calcul des charges est constitué des factures d'achats de type dépense et des salaires.
                </UncontrolledTooltip>
              </div>
              <WidgetCountUp
                xl={12}
                data={{ name: "Dépenses Totales", icon: "arrow-down-right", total: report?.charges?.dataGraph.reduce((accumulator, currentValue) => accumulator + currentValue, 0), nb: report?.charges?.nb_charge, text: "Charges et frais dépensés" }}
                type={""}></WidgetCountUp>
            </Col>

            <div>
              <Card>
                <CardBody className="mb-2">
                  <ReactApexChart
                    options={options}
                    series={data || null}
                    type="bar"
                    height={350}
                  />
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Reports;
