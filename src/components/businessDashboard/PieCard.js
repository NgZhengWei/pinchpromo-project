// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
// Custom components
import Card from "../card/Card.js";
import PieChart from "../charts/PieChart";
import { pieChartOptions } from "../variables/charts";
import { VSeparator } from "../separator/Separator";

export default function Conversion(props) {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  return (
    <Card p="20px" align="center" direction="column" w="100%">
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          Claimed vs Unclaimed Promotions
        </Text>
      </Flex>

      <PieChart
        h="100%"
        w="100%"
        chartData={props.piechartdata}
        chartOptions={pieChartOptions}
      />
      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
      >
        <Flex direction="column" py="5px">
          <SimpleGrid columns={2} my="20px">
            <Flex direction="row" align="center" justify="center">
              <Box
                h="8px"
                w="8px"
                bg="#4318FF"
                borderRadius="50%"
                me="4px"
                mb="8px"
              />
              <Text
                fontSize="xs"
                color="secondaryGray.600"
                fontWeight="700"
                mb="5px"
              >
                Total Unclaimed Promotions
              </Text>
            </Flex>
            <Text fontSize="lg" color={textColor} fontWeight="700">
              {props.piechartdata[0]}
            </Text>
          </SimpleGrid>

          <SimpleGrid columns={2} my="20px">
            <Flex direction="row" align="center" justify="center">
              <Box
                h="8px"
                w="8px"
                bg="#6AD2FF"
                borderRadius="50%"
                me="4px"
                mb="8px"
              />
              <Text
                fontSize="xs"
                color="secondaryGray.600"
                fontWeight="700"
                mb="5px"
              >
                Total Claimed Promotions
              </Text>
            </Flex>
            <Text fontSize="lg" color={textColor} fontWeight="700">
              {props.piechartdata[1]}
            </Text>
          </SimpleGrid>
        </Flex>
      </Card>
    </Card>
  );
}
