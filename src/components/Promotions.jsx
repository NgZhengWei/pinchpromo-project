import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Button,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import BigPromotion from "./BigPromotion";
import { QuestionIcon } from "@chakra-ui/icons";
import getDayDifference from "../util/getDayDifference";
import { getOneUser } from "../util/getData";

const Promotions = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [bigPromotions, setBigPromotions] = useState([]);
  // const [timeToNextClaim, setTimeToNextClaim] = useState('');
  const [claimRemainingMessage, setClaimRemainingMessage] = useState("");
  const [runningInterval, setRunningInterval] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bigPromotionsCollectionRef = collection(db, "bigPromotions");

  let userRef;
  if (currentUser) {
    userRef = doc(db, "users", currentUser.uid);
  }

  // input: release time obtained from promotions object
  // output: true if current time is past release time and within a week of relase (7 days)
  function shouldDisplay(releaseTime) {
    const dayDiff = getDayDifference(new Date(), new Date(releaseTime));
    // console.log(dayDiff);
    // check for -0 is to account for expiry date bring the day before, in which case it should return false
    return dayDiff !== -0 && dayDiff >= 0 && dayDiff <= 7;
  }

  useEffect(() => {
    document.title = "Promotions";

    const getBigPromotions = async () => {
      try {
        let filteredData;
        const data = await getDocs(bigPromotionsCollectionRef);

        if (currentUser) {
          try {
            const user = await getOneUser(currentUser.uid);
            setUserData(user);

            filteredData = data.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              promotions: user.promotions,
              usedPromotions: user.usedPromotions,
              claimAvailable: user.claimAvailable,
            }));
          } catch (e) {
            console.error(e);
          }
        } else {
          filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            promotions: [],
            usedPromotions: [],
          }));
        }

        // sort by initTime, latest release on top
        filteredData.sort(function (a, b) {
          return new Date(b.initTime) - new Date(a.initTime);
        });

        setBigPromotions(filteredData);
      } catch (e) {
        console.error(e);
      }
    };

    getBigPromotions();
  }, []);

  useEffect(() => {
    manageClaims();
  }, [userData]);

  // show number of claims available
  function manageClaims() {
    // clear existing intervals. This is for when user uses a claim and it causes 2 intervals to exist, resulting in a bug
    if (runningInterval) {
      clearInterval(runningInterval);
      setRunningInterval(false);
    }

    if (Object.keys(userData).length === 0) {
      // data has not yet loaded
      setClaimRemainingMessage("");
    } else if (userData.claimAvailable === userData.claimCapacity) {
      // user has all claims possible, not recharging claims
      setClaimRemainingMessage(
        `Claim promotions from your favourite brands now!`
      );
    } else if (userData.claimAvailable < userData.claimCapacity) {
      // user is regenerating a new claim
      const interval = window.setInterval(function () {
        const now = new Date();
        const diff = new Date(userData.nextClaimTime) - now;

        if (diff <= 0) {
          incrementClaims();
          clearInterval(interval);
        } else {
          const hours = String(
            Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          ).padStart(2, "0");
          const minutes = String(
            Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          ).padStart(2, "0");
          const seconds = String(Math.floor((diff % (1000 * 60)) / 1000));
          let secondsString = String(seconds).padStart(2, "0");

          const timeToNextClaim = hours + ":" + minutes + ":" + secondsString;
          setClaimRemainingMessage(`New claim in ${timeToNextClaim}.`);
        }
      }, 1000);

      setRunningInterval(interval);
    }
  }

  async function incrementClaims() {
    const today = new Date();
    // used here to make reset time 12am the next day
    const tomorrow = new Date(today);
    // setDate auto changes date to next month if it is say 31 Jul
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    try {
      if (userData.claimAvailable + 1 >= userData.claimCapacity) {
        // if user has reached their claim capacity, increment claim by 1 and set next claim time to empty so they are not regenerating the next claim
        updateDoc(doc(db, "users", currentUser.uid), {
          nextClaimTime: "",
          claimAvailable: userData.claimAvailable + 1,
        });
        setUserData((prevState) => ({
          ...prevState,
          nextClaimTime: "",
          claimAvailable: userData.claimAvailable + 1,
        }));
      } else {
        // user has not reached claim capacity, increment claim and start regenerating the next claim
        updateDoc(doc(db, "users", currentUser.uid), {
          nextClaimTime: tomorrow.toJSON(),
          claimAvailable: userData.claimAvailable + 1,
        });
        setUserData((prevState) => ({
          ...prevState,
          nextClaimTime: tomorrow.toJSON(),
          claimAvailable: userData.claimAvailable + 1,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function decrementClaims() {
    try {
      const today = new Date();
      // used here to make reset time 12am the next day
      const tomorrow = new Date(today);
      // setDate auto changes date to next month if it is say 31 Jul
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // nextClaimTime will remain as it is, it it's already defined. Else we will set it to be 24hrs from now
      const newNextClaimTime =
        userData.nextClaimTime.length === 0
          ? tomorrow.toJSON()
          : userData.nextClaimTime;
      updateDoc(doc(db, "users", currentUser.uid), {
        nextClaimTime: newNextClaimTime,
        claimAvailable: userData.claimAvailable - 1,
      });
      // setUserData((prevState) => {
      //   console.dir({
      //     ...prevState,
      //     nextClaimTime: newNextClaimTime,
      //     claimAvailable: prevState.claimAvailable - 1,
      //   });

      //   return {
      //     ...prevState,
      //     nextClaimTime: newNextClaimTime,
      //     claimAvailable: prevState.claimAvailable - 1,
      //   };
      // });
    } catch (e) {
      console.error(e);
    }
  }

  const newUserInfoAccordion = (
    <Accordion allowToggle background="gray.100">
      <AccordionItem>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            How PinchPromo Works
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Text mb="15px">
            New exclusive promos are <b>released daily</b> for you to maximise
            your dollar.
          </Text>

          <Text mb="15px">
            Each promo will only be <b>claimable for 7 days</b> in "Claim
            Promos" tab before disappearing. You get 1 claim per day which
            resets at 12am, so choose wisely.
          </Text>

          <Text mb="15px">
            <Link href="/signup" color="blue.400">
              Sign Up Now
            </Link>{" "}
            to start saving 😊
          </Text>

          <Text>
            For more info, refer to our{" "}
            <Link href="/howtouse" color="blue.400">
              how to use
            </Link>{" "}
            page!
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );

  return (
    <Container pb="20px">
      {!currentUser && newUserInfoAccordion}
      {currentUser && (
        <Card
          textAlign="center"
          py="15px"
          variant="outline"
          position="relative"
        >
          <Text>Claims available</Text>
          <CardHeader p="0px">
            <Heading as="h3">
              {userData.claimAvailable}/{userData.claimCapacity}
            </Heading>
          </CardHeader>
          <CardBody px="0px" py="0px">
            <Text>{claimRemainingMessage}</Text>
          </CardBody>

          <Button
            onClick={onOpen}
            variant="unstyled"
            position="absolute"
            right="5px"
            top="5px"
          >
            <QuestionIcon boxSize={6} _hover={{ color: "white" }} />
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader mt="20px">
                <Heading textAlign="center"> How does PinchPromo work?</Heading>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb="15px">
                  New exclusive promos are <b>released daily</b> for you to
                  maximise your dollar.
                </Text>

                <Text mb="15px">
                  Each promo will only be <b>claimable for 7 days</b> in "Claim
                  Promos" tab before disappearing. You get 1 claim per day which
                  resets at 12am, so choose wisely!
                </Text>

                <Text mb="15px">
                  Your claimed promos are found in the "Claimed" tab and can be{" "}
                  <b>used once the details are released</b>. So be sure to check
                  back daily to secure the best promotions.
                </Text>

                <Text>Happy Pinching Promos 😊</Text>
              </ModalBody>

              <ModalFooter>
                <Button
                  backgroundColor="brandYellow.100"
                  mr={3}
                  onClick={onClose}
                  _focus={{ backgroundColor: "brandYellow.200" }}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Card>
      )}

      {bigPromotions.length > 0 && (
        <Heading textAlign="center" mt="25px">
          Promotions Available
        </Heading>
      )}
      {bigPromotions.length > 0 &&
        bigPromotions.map((promotion) => {
          // if current time has not exceeded init time, dont show it
          if (new Date() - new Date(promotion.initTime) < 0) {
            return "";
          } else if (
            getDayDifference(new Date(), new Date(promotion.initTime)) > 7
          ) {
            // if a week has passed since the promotion has been released, dont display it.
            return "";
          }

          return (
            <BigPromotion
              promotion={promotion}
              key={promotion.id}
              decrementClaims={decrementClaims}
              userData={userData}
            />
          );
        })}

      {bigPromotions.length === 0 && (
        <Heading textAlign="center" mt="15px">
          Refresh the page to view promos!
        </Heading>
      )}
    </Container>
  );
};

export default Promotions;
