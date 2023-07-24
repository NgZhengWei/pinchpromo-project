// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "../card/Card.js";
import PieChart from "../charts/PieChart";
import {pieChartOptions} from "../variables/charts";
import firebase from "../../firebase"; // Path to your firebase.js file
import { VSeparator } from "../separator/Separator";
import { React, useEffect, useState } from "react";

export default function Conversion(props) {
  const [orders, setOrders] = useState(0);
  const [inventory, setInventory] = useState(0);
  
  useEffect(() => {
    sumNumberOfCoupons().then((res) => {
      setOrders(res);
    });
    sumNumberOfClaimedCoupons().then((res) => {
      setInventory(res);
    });
    });
  
  const totalPromotionsPercentage = {orders} * 100/({orders} + {inventory})
  const totalClaimedPromotionsPercentage = {inventory} * 100/({orders} + {inventory})
  // const pieChartData = [
  //   { label: "Total Promotions", data: totalPromotionsPercentage },
  //   { label: "Total Claimed Promotions", data: totalClaimedPromotionsPercentage },
  // ];
  const pieChartData = [253, 54]
  
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          Total/Claimed Promotions
        </Text>
      </Flex>
      
      <PieChart
        h='100%'
        w='100%'
        chartData = {pieChartData}
        chartOptions={pieChartOptions}
      />
      <Card
        bg={cardColor}
        flexDirection='row'
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'>
        <Flex direction='column' py='5px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='brand.500' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Total Promotions
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            {orders}
          </Text>
        </Flex>
        <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} />
        <Flex direction='column' py='5px' me='10px'>
          <Flex align='center'>
            <Box h='8px' w='8px' bg='#6AD2FF' borderRadius='50%' me='4px' />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              Claimed
            </Text>
          </Flex>
          <Text fontSize='lg' color={textColor} fontWeight='700'>
            {inventory}
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}

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
