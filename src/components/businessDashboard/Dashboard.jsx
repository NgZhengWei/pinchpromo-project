import { React, useEffect, useState } from "react";
// import { Card, Space, Statistic, Table, Typography } from "antd";
import { Card, CardHeader, CardBody, CardFooter, Text} from '@chakra-ui/react'
import firebase from "../../firebase"; // Path to your firebase.js file
import BarChart from "../charts/BarChart"
import LineChart from "../charts/LineChart"
import PieChart from "../charts/PieChart"

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "../../assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "../calendar/MiniCalendar.js";
import MiniStatistics from "../card/MiniStatistics";
import IconBox from "../icons/IconBox";

import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdPersonPin,
} from "react-icons/md";
import PieCard from "./PieCard";
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
    sumNumberOfClaimedCoupons().then((res) => {
      setInventory(res);
    });
    getCustomers().then((res) => {
      setCustomers(res);
    });

    // fetchBusinessData().then((data) => {
    //   setBusinessData(data);
    // });
  }, []);
  
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Total Promotions'
          value= {orders}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Promotions Claimed'
          value={inventory}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdPersonPin} color={brandColor} />
              }
            />
          }
          name='Customers'
          value={customers}
        />
        {/* <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='New Tasks'
          value='154'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total Projects'
          value='2935' */}
        
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <PieCard />
        </SimpleGrid>
      </Box>
      
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

const sumNumberOfClaimedCoupons = () => {
  const businessRef = firebase.firestore().collection("bigPromotions");
  return businessRef.get().then((querySnapshot) => {
    let totalClaimedOrders = 0;
    querySnapshot.forEach((doc) => {
      const business = doc.data();
      totalClaimedOrders += business.numberOfCouponsClaimed;
    });
    return totalClaimedOrders;
  });
};

const getCustomers = () => {
  const customerRef = firebase.firestore().collection("users");
  return customerRef.get().then((querySnapshot) => {
    const totalCustomers = querySnapshot.size;
    return totalCustomers;
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