import { React, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";
import PieChart from "../charts/PieChart";

// Chakra imports
import { Box, Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
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
  MdLibraryAddCheck,
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

// Fake Data
import {
  barChartData as barChartDataTemplate,
  barChartOptions as barChartOptionsTemplate,
  lineChartData,
  lineChartOptions,
} from "../charts/chartData.js";
import { doc, getDoc } from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [claimedCoupons, setClaimedCoupons] = useState(0);
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState(
    barChartOptionsTemplate
  );
  const [pieChartData, setPieChartData] = useState([0, 0]);
  const [pieChartOptions, setPieChartOptions] = useState({});

  useEffect(() => {
    async function getData() {
      const userSnapshot = await getDoc(doc(db, "users", currentUser.uid));
      const user = userSnapshot.data();

      setUserData(user);

      const promises = [];
      for (let i = 0; i < user.promotions.length; i++) {
        promises.push(getDoc(doc(db, "bigPromotions", user.promotions[i])));
      }

      Promise.all(promises).then((docSnaps) => {
        const titles = [];
        const claimedNumbers = [];
        const totalNumbers = [];

        // getting data from promise response
        docSnaps.forEach((promo) => {
          const data = promo.data();
          titles.push(data.title);
          claimedNumbers.push(data.numberOfCouponsClaimed);
          totalNumbers.push(data.numberOfCoupons);
        });

        setBarChartData([
          {
            name: "Number of Claims",
            data: claimedNumbers,
          },
          {
            name: "Total number of coupons",
            data: totalNumbers,
          },
        ]);

        setBarChartOptions({
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
            categories: titles,
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
          dataLabels: {
            enabled: true,
          },
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: "40px",
            },
          },
        });

        // summing up the array of claimed coupons and total coupons
        const totalCouponsSum = totalNumbers.reduce(
          (sum, number) => sum + number,
          0
        );
        const totalClaimedCoupons = claimedNumbers.reduce(
          (sum, number) => sum + number,
          0
        );

        setPieChartData([
          totalCouponsSum - totalClaimedCoupons,
          totalClaimedCoupons,
        ]);

        setTotalCoupons(totalCouponsSum);
        setClaimedCoupons(totalClaimedCoupons);
      });
    }

    getData();
  }, []);

  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  return (
    <Box py={{ base: "0px", md: "20px", xl: "30px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
        width={{ base: "80%", md: "50%", xl: "100%" }}
        mx="auto"
        // display="flex"
        // justifyContent="center"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon           
                
                w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Total Promotions"
          value={totalCoupons}
        />

        <MiniStatistics
          startContent={
            <IconBox
            
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
          
                  w="32px"
                  h="32px"
                  as={MdLibraryAddCheck}
                  color={brandColor}
                />
              }
            />
          }
          name="Promotions Claimed"
          value={claimedCoupons}
        />

        {/* <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdPersonPin} color={brandColor} />
              }
            />
          }
          name="Customers"
          value={claimedCoupons}
        /> */}
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
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
        <PieCard piechartdata={pieChartData} />
        <BarChart chartData={barChartData} chartOptions={barChartOptions} />
        {/* <LineChart
          chartData={lineChartData}
          chartOptions={lineChartOptions}
        /> */}
      </SimpleGrid>

      {/* <SimpleGrid>
        <LineChart chartData={lineChartData} chartOptions={lineChartOptions} />
      </SimpleGrid> */}
    </Box>
  );
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
