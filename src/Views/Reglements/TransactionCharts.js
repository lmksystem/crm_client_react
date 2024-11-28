import React from "react";
import { Card, CardBody } from "reactstrap";
import { useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";

const TransactionCharts = ({ chartData }) => {
  const linechartcustomerColors = getChartColorsArray('["--vz-primary", "--vz-warning", "--vz-success"]');

  const { devise } = useSelector((state) => ({
    devise: state?.Company?.devise
  }));

  var options = {
    chart: {
      defaultLocale: "fr",
      locales: [
        {
          name: "fr",
          options: {
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            toolbar: {
              exportToSVG: "Export SVG",
              exportToPNG: "Export PNG",
              exportToCSV: "Export CSV"
            }
          }
        }
      ],
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
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toFixed(0); // Formater les valeurs à deux chiffres après la virgule
        }
      }
    },
    stroke: {
      curve: "straight",
      dashArray: [0, 0, 8],
      width: [2, 0, 2.2]
    },
    fill: {
      opacity: [0.8, 0.9, 1]
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4
      }
    },
    xaxis: {
      categories: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 15,
        left: 10
      }
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        barHeight: "70%"
      }
    },
    colors: linechartcustomerColors,
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            return y + devise;
          }
        }
      ]
    }
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
                series={[{ name: "Transaction", type: "bar", data: chartData }]}
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
