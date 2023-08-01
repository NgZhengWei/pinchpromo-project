// Bar Chart
export const barChartData = [
  {
    name: "Number of Claims",
    data: [20, 30, 40, 20, 45, 50, 30],
  },
];

export const barChartOptions = {
  chart: {
    toolbar: {
      show: true,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: [
      "promotionA",
      "promotionB",
      "promotionC",
      "promotionD",
      "promotionE",
      "promotionF",
      "promotionG",
    ],
    show: true,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
    color: "black",
    labels: {
      show: true,
      style: {
        colors: "#CBD5E0",
        fontSize: "14px",
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
//   fill: {
//     type: "gradient",
//     gradient: {
//       type: "vertical",
//       shadeIntensity: 1,
//       opacityFrom: 0.7,
//       opacityTo: 0.9,
//       colorStops: [
//         [
//           {
//             offset: 0,
//             color: "#4318FF",
//             opacity: 1,
//           },
//           {
//             offset: 100,
//             color: "rgba(67, 24, 255, 1)",
//             opacity: 0.28,
//           },
//         ],
//       ],
//     },
//   },
  dataLabels: {
    enabled: true,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "40px",
    },
  },
};

// Line Chart
export const lineChartData = [
  {
    name: "Number of Customers",
    data: [10,20,10,20,30,40,30,40,50,60,50,60],
  },
  {
    name: "Number of Claims",
    data: [1,2,1,2,3,4,3,4,5,6,5,6],
  },
];

export const lineChartOptions = {
  chart: {
    toolbar: {
      show: true,
    },
    dropShadow: {
      enabled: false,
      top: 13,
      left: 0,
      blur: 10,
      opacity: 0.1,
      color: "#4318FF",
    },
  },
  colors: ["#4318FF", "#39B8FF"],
  markers: {
    size: 0,
    colors: "white",
    strokeColors: "#7551FF",
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    shape: "rectangle",
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: "straight",
    type: "line",
  },
  xaxis: {
    type: "numeric",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
  },
  legend: {
    show: true,
  },
  grid: {
    show: false,
    column: {
      color: ["#7551FF", "#39B8FF"],
      opacity: 0.5,
    },
  },
  color: ["#7551FF", "#39B8FF"],
};
