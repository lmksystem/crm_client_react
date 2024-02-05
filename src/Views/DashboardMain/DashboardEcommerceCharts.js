import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";
import { useSelector } from "react-redux";

const RevenueCharts = ({ dataColors, series }) => {
  const linechartcustomerColors = getChartColorsArray(dataColors);

  const { devise } = useSelector((state) => ({
    devise: state?.Company?.devise,
  }));

  function abregerSomme(somme) {
    if (somme < 500) {
      return somme.toString() + devise;
    } else if (somme < 10000) {
      return (somme / 1000).toFixed(1) + "K " + devise
    } else {
      return (somme / 1000).toFixed(0) + "K " + devise;
    }
  }


  var options = {
    chart: {
      height: 350,
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
      opacity: [0.1, 0.9, 1],
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
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
      categories: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
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
      floating: true,
      decimalsInFloat: 2,
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
        right: -2,
        bottom: 15,
        left: 10,
      },
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
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        barHeight: "70%",
      },
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
      y: [
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " Devis";
            }
            return y;
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return abregerSomme(y);
            }
            return y;
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " Factures";
            }
            return y;
          },
        },
      ],
    },
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

const StoreVisitsCharts = ({ dataColors }) => {
  const chartDonutBasicColors = getChartColorsArray(dataColors);

  const series = [44, 55, 41, 17, 15];
  var options = {
    labels: ["Direct", "Social", "Email", "Other", "Referrals"],
    chart: {
      height: 333,
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    colors: chartDonutBasicColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart dir="ltr"
        options={options}
        series={series}
        type="donut"
        height="333"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export { RevenueCharts, StoreVisitsCharts };
