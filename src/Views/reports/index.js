import React, { useEffect, useId, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import WidgetCountUp from "../../Components/Common/WidgetCountUp";
import ReactApexChart from "react-apexcharts";
import { getReportData as onGetReportData } from "../../slices/thunks";

moment.updateLocale('en')

const Reports = () => {
  document.title = "Rapports | Countano";

  const { report } = useSelector((state) => ({
    report: state.Report.report
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    let date_start = moment().startOf('year');
    let date_end = moment().endOf('year');

    dispatch(onGetReportData({ date_start: date_start.format("YYYY-MM-DD"), date_end: date_end.format("YYYY-MM-DD") }));
  }, [])

  let data = [{
    name: 'Revenues',
    data: report.revenus.dataGraph
  }, {
    name: 'Dépenses',
    data: report.charges.dataGraph
  }];


  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#00A34C", "#FF9F00"],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juill', 'Août', 'Sept', 'Oct', 'Nov', 'déc'],
    },
    yaxis: {
      title: {
        text: ''
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " €"
        }
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Rapports" pageTitle="Countano" />
          <Row>

            <WidgetCountUp xl={6} data={{ name: "Revenu Total", icon: "arrow-up-right", total: report.revenus.dataGraph.reduce((accumulator, currentValue) => (accumulator + currentValue), 0), nb: report.revenus.nb_facture, text: "factures payées" }} type={''}></WidgetCountUp>
            <WidgetCountUp xl={6} data={{ name: "Dépense Totale", icon: "arrow-down-right", total: report.charges.dataGraph.reduce((accumulator, currentValue) => (accumulator + currentValue), 0), nb: report.charges.nb_charge, text: "Nombre de charge comprise"  }} type={''}></WidgetCountUp>
            {/* <WidgetCountUp xl={4} data={{ name: "", icon: "", total: 0 }} type={''}></WidgetCountUp> */}
            <div>
              <Card>
                <CardBody className="mb-2">
                  <ReactApexChart options={options} series={data || null} type="bar" height={350} />
                </CardBody>
              </Card>
            </div>

          </Row>


        </Container>
      </div >
    </React.Fragment >
  );
};

export default Reports;
