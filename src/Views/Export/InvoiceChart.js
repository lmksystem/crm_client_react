import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import { Card, CardBody } from "reactstrap";
import { useSelector } from "react-redux";

const InvoiceChart = ({ dataColors, series }) => {
  const { devise } = useSelector((state) => ({
    devise: state?.Company?.devise
  }));

  const linechartcustomerColors = getChartColorsArray(dataColors);
  // console.log("series",series)
  function abregerSomme(somme) {
    if (somme < 500) {
      return somme.toString() + devise;
    } else if (somme < 10000) {
      return (somme / 1000).toFixed(1) + "K " + devise;
    } else {
      return (somme / 1000).toFixed(0) + "K " + devise;
    }
  }

  var options = {
    chart: {
      defaultLocale: "fr",
      locales: [
        {
          name: "fr"
        }
      ],
      height: 370,
      type: "line",
      toolbar: {
        show: false
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
      // categories: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      type: "datetime",
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toFixed(0); // Formater les valeurs à deux chiffres après la virgule
        }
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
      shared: false,
      y: [
        {
          formatter: function (y) {
            return abregerSomme(y);
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
