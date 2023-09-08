import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
// import { RevenueCharts } from "./DashboardEcommerceCharts";
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { getRevenueChartsData } from "../../slices/thunks";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";

const TransactionCharts = ({ chartData }) => {
  const dispatch = useDispatch();
  const linechartcustomerColors = getChartColorsArray('["--vz-primary", "--vz-warning", "--vz-success"]');


  var options = {
    chart: {
      height: 370,
      type: "line",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: []
        },
      },

    },
    stroke: {
      curve: "straight",
      dashArray: [0, 0, 8],
      width: [2, 0, 2.2],
    },
    fill: {
      opacity: [0.8, 0.9, 1],
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: [
        "Janvier",
        "Febier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },

    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 15,
        left: 10,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        barHeight: "70%",
      },
    },
    colors: linechartcustomerColors,
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            return y + "€";
          },
        },
      ],
    },
  };

  return (
    <React.Fragment>
      <Card>


        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <ReactApexChart
                dir="ltr"
                options={options}
                series={[{ name: 'Transaction', type: 'bar', data: chartData }]}
                type="line"
                height="370"
                className="apex-charts"
              />

            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default TransactionCharts;
