import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {
  Container,
  Heading,
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import UserPromotion from "./UserPromotion";
import InfoModal from "./InfoModal";

const UserPromotions = () => {
  const { currentUser } = useAuth();
  const [userActivePromotions, setUserActivePromotions] = useState([]);
  const [userPendingPromotions, setUserPendingPromotions] = useState([]);
  const [userUsedPromotions, setUserUsedPromotions] = useState([]);
  const userRef = doc(db, "users", currentUser.uid);

  useEffect(() => {
    document.title = "Claimed Promotions";

    const getBigPromotions = async () => {
      try {
        const activeUserPromos = [];
        const pendingUserPromos = [];
        const usedUserPromos = [];

        const userDataPromise = await getDoc(userRef);
        const userData = userDataPromise.data();

        const promotionsSnap = await getDocs(collection(db, "bigPromotions"));
        const currentDate = new Date();

        promotionsSnap.docs.map((doc) => {
          if (userData.promotions.includes(doc.id)) {
            // split active promotions into usable and pending promotions
            if (currentDate > new Date(doc.data().releaseTime)) {
              activeUserPromos.push({
                ...doc.data(),
                id: doc.id,
              });
            } else {
              pendingUserPromos.push({
                ...doc.data(),
                id: doc.id,
              });
            }
          } else if (userData.usedPromotions.includes(doc.id)) {
            usedUserPromos.push({
              ...doc.data(),
              id: doc.id,
            });
          }
        });

        activeUserPromos.sort(function (a, b) {
          return new Date(a.releaseTime) - new Date(b.releaseTime);
        });

        pendingUserPromos.sort(function (a, b) {
          return new Date(a.releaseTime) - new Date(b.releaseTime);
        });

        setUserActivePromotions(activeUserPromos);
        setUserPendingPromotions(pendingUserPromos);
        setUserUsedPromotions(usedUserPromos);
      } catch (e) {
        console.error(e);
      }
    };

    getBigPromotions();
  }, []);

  const headingFontSize = { base: "28px", sm: "32px", md: "36px" };
  const bodyFontSize = { base: "13px", sm: "16px" };

  return (
    <Container>
      <Box position="relative">
        <Heading as="h2" mb="8px" textAlign="center" fontSize={headingFontSize}>
          Ready To Use Promos
        </Heading>
        <InfoModal btnPosition={"absolute"} />
      </Box>

      {userActivePromotions.length <= 0 &&
        userPendingPromotions.length <= 0 &&
        userUsedPromotions.length <= 0 && (
          <Text textAlign="center" fontSize={bodyFontSize}>
            No claimed promotions. Go to "Claim Promos" tab to get your first
            one!
          </Text>
        )}

      {userActivePromotions.length <= 0 &&
        (userPendingPromotions.length > 0 || userUsedPromotions.length > 0) && (
          <Text textAlign="center" fontSize={bodyFontSize} mb="20px">
            No usable promotions. Keep an eye on your pending promos tab for
            when promos details are released!
          </Text>
        )}
      {userActivePromotions.map((promotion) => (
        <UserPromotion key={promotion.id} promotion={promotion} used={false} />
      ))}

      <Accordion allowToggle pb="50px">
        {userPendingPromotions.length > 0 && (
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Heading
                  as="h2"
                  textAlign="center"
                  fontSize={headingFontSize}
                  py="10px"
                >
                  Pending Promos
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {userPendingPromotions.map((promotion) => (
                <UserPromotion
                  key={promotion.id}
                  promotion={promotion}
                  used={false}
                />
              ))}
            </AccordionPanel>
          </AccordionItem>
        )}

        {userUsedPromotions.length > 0 && (
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Heading
                  as="h2"
                  textAlign="center"
                  fontSize={headingFontSize}
                  py="10px"
                >
                  Used Promos
                </Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {userUsedPromotions.map((promotion) => (
                <UserPromotion
                  key={promotion.id}
                  promotion={promotion}
                  used={true}
                />
              ))}
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </Container>
  );
};

export default UserPromotions;
