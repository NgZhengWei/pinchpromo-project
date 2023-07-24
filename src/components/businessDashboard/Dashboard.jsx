import { React, useEffect, useState } from "react";
// import { Card, Space, Statistic, Table, Typography } from "antd";
import { Card, CardHeader, CardBody, CardFooter, Text} from '@chakra-ui/react'
import firebase from "../../firebase"; // Path to your firebase.js file
import BarChart from "../charts/BarChart"
import LineChart from "../charts/LineChart"
import PieChart from "../charts/PieChart"

import {
  lineChartDataOverallRevenue,
  lineChartOptionsOverallRevenue,
  barChartDataDailyTraffic,
  barChartOptionsDailyTraffic,
  pieChartData,
  pieChartOptions,
} from "../variables/charts"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [orders, setOrders] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [businessData, setBusinessData] = useState([]);
  
  useEffect(() => {
    sumNumberOfCoupons().then((res) => {
      setOrders(res);
    });
    // sumNumberOfClaimedCoupons().then((res) => {
    //   setInventory(res);
    // });
    // getCustomers().then((res) => {
    //   setCustomers(res);
    // });

    // fetchBusinessData().then((data) => {
    //   setBusinessData(data);
    // });
  }, []);
  
  return (  
    <div>
          <DashboardCard
            title={"Total Promotions"}
            value={orders}
          />
          {/* <RecentOrders /> */}
    </div>
  );
};
    
const sumNumberOfCoupons = () => {
  const businessRef = firebase.firestore().collection("bigPromotions");
  return businessRef.get().then((querySnapshot) => {
    let totalOrders = 0;
    querySnapshot.forEach((doc) => {
      const business = doc.data();
      totalOrders += business.numberOfCoupons;
    });
    return totalOrders;
  });
};

const DashboardCard = ({ title, value, icon }) => {
  return (
    <Card>
      {/* <Space direction="horizontal"> */}
        {icon}
        title={title} value={value} 
      {/* </Space> */}
    </Card>
  );
};


export default Dashboard;