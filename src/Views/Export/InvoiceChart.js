import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import { Card, CardBody } from "reactstrap";

const InvoiceChart = ({ dataColors, series }) => {
  const linechartcustomerColors = getChartColorsArray(dataColors);
  // console.log("series",series)
  function abregerSomme(somme) {
    if (somme < 500) {
      return somme.toString() + "€";
    } else if (somme < 10000) {
      return (somme / 1000).toFixed(1) + "K €"
    } else {
      return (somme / 1000).toFixed(0) + "K €";
    }
  }


  var options = {
    chart: {
      defaultLocale: 'fr',
      locales: [{
        name: 'fr',
        options: {
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        }
      }],
      height: 370,
      type: "line",
      toolbar: {
        show: false,
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
      shared: false,
      y: [
        {
          formatter: function (y) {
            return abregerSomme(y);
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
                series={series}
                type="bar"
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


export default InvoiceChart;
