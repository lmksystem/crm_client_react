import React, { useEffect, useId, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import Section from "../DashboardMain/Section";
import moment from 'moment';
import Flatpickr from "react-flatpickr";
import {
  getInvoices as onGetInvoices
} from '../../slices/thunks'
import { api } from "../../config";
import axios from "axios";
import CountUp from "react-countup";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import WidgetCountUp from "../../Components/Common/WidgetCountUp";
import ReactApexChart from "react-apexcharts";


moment.updateLocale('en')

const Rapport = () => {
  document.title = "Rapports | Countano";

  const dispatch = useDispatch();
  let state = {

    series: [{
      name: 'Revenues',
      data: [44, 99, 55, 57, 105, 87, 60, 91, 114, 94, 56, 61]
    }, {
      name: 'Dépenses',
      data: [76, 60, 85, 101, 98, 61, 58, 63, 60, 66, 56, 61]
    }],
    options: {
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
    },


  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Rapports" pageTitle="Countano" />
          <Row>

            <WidgetCountUp xl={6} data={{ name: "Revenues", icon: "arrow-up-right", total: 0 }} type={''}></WidgetCountUp>
            <WidgetCountUp xl={6} data={{ name: "Dépenses", icon: "arrow-down-right", total: 0 }} type={''}></WidgetCountUp>
            {/* <WidgetCountUp xl={4} data={{ name: "", icon: "", total: 0 }} type={''}></WidgetCountUp> */}
            <div>
              <Card>
                <CardBody className="mb-2">
                  <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
                </CardBody>
              </Card>
            </div>

          </Row>


        </Container>
      </div >
    </React.Fragment >
  );
};

export default Rapport;
