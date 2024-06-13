import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import { useSelector } from "react-redux";

const RevenueCharts = ({ dataColors, series }) => {
  const linechartcustomerColors = getChartColorsArray(dataColors);

  const { devise } = useSelector((state) => ({
    devise: state?.Company?.devise
  }));

  var options = {
    chart: {
      zoom: {
        enabled: false,
      },
      height: 350,
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
      opacity: [0.1, 0.9, 1]
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4
      }
    },
    // yaxis: [{
    //   title: {
    //     text: 'Nombre devis/factures',
    //   },
    //   seriesName:"Facture",
    //   min:0,
    //   opposite: true,
    //   tickAmount:1,
    //   floating: false,
    //   decimalsInFloat: 0,
    // }, {
    //   title: {
    //     text: 'Vente €'
    //   },

    // }],
    xaxis: {
      categories: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      },
      floating: true,
      decimalsInFloat: 2
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
        right: -2,
        bottom: 15,
        left: 10
      }
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      height: 70,
      offsetX: 0,
      offsetY: -5,
      markers: {
        width: 9,
        height: 9,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        barHeight: "70%"
      }
    },

    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toFixed(0); // Formater les valeurs à deux chiffres après la virgule
        }
      }
    },
    colors: linechartcustomerColors,
    tooltip: {
      shared: true,
      x: { show: false },
      y: [
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;
          }
        },
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(2) + " " + devise;
            }
            return y + " " + devise;
          }
        },
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;
          }
        },
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(2) + " " + devise;
            }
            return y.toFixed(2) + " " + devise;
          }
        }
      ]
    }
  };
  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        type="line"
        height="350"
        className="apex-charts"
      />
    </React.Fragment>
  );
};


export { RevenueCharts };
