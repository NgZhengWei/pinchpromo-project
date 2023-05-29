import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  getDocs,
  collection,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { Container, Text } from '@chakra-ui/react';
import BigPromotion from './BigPromotion';

const Promotions = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [bigPromotions, setBigPromotions] = useState([]);
  // const [timeToNextClaim, setTimeToNextClaim] = useState('');
  const [claimRemainingMessage, setClaimRemainingMessage] = useState('');
  const [runningInterval, setRunningInterval] = useState(false);

  const bigPromotionsCollectionRef = collection(db, 'bigPromotions');

  let userRef;
  if (currentUser) {
    userRef = doc(db, 'users', currentUser.uid);
  }

  // input: date object as input
  // return: day difference rounded up to nearest int (date1 - date2)
  // if return is -ve means day has passed
  function getDayDifference(date1, date2) {
    const diffTime = date1 - date2;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    const getBigPromotions = async () => {
      try {
        console.log('USE EFFECT IN PROMOTIONS RENDER');
        let filteredData;
        const data = await getDocs(bigPromotionsCollectionRef);

        if (currentUser) {
          const userData = await getDoc(userRef);
          setUserData(userData.data());

          filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            promotions: userData.data().promotions,
            usedPromotions: userData.data().usedPromotions,
            claimAvailable: userData.data().claimAvailable,
          }));
        } else {
          filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            promotions: [],
            usedPromotions: [],
          }));
        }

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

  function manageClaims() {
    // clear existing intervals. This is for when user uses a claim and it causes 2 intervals to exist, resulting in a bug
    if (runningInterval) {
      clearInterval(runningInterval);
      setRunningInterval(false);
    }

    if (Object.keys(userData).length === 0) {
      setClaimRemainingMessage('');
    } else if (userData.claimAvailable === userData.claimCapacity) {
      // user has all claims possible, not recharging claims
      setClaimRemainingMessage(
        `You have ${userData.claimAvailable}/${userData.claimCapacity} claims. Claim promotions from your favourite brands now!`
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
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          let secondsString = String(seconds);
          if (secondsString.length === 1) {
            secondsString = '0' + secondsString;
          }
          const timeToNextClaim = hours + ':' + minutes + ':' + secondsString;
          setClaimRemainingMessage(
            `You have ${userData.claimAvailable}/${userData.claimCapacity} claims. New claim in ${timeToNextClaim}.`
          );
        }
      }, 1000);

      setRunningInterval(interval);
    }
  }

  async function incrementClaims() {
    try {
      if (userData.claimAvailable + 1 >= userData.claimCapacity) {
        // if user has reached their claim capacity, increment claim by 1 and set next claim time to empty so they are not regenerating the next claim
        updateDoc(doc(db, 'users', currentUser.uid), {
          nextClaimTime: '',
          claimAvailable: userData.claimAvailable + 1,
        });
        setUserData((prevState) => ({
          ...prevState,
          nextClaimTime: '',
          claimAvailable: userData.claimAvailable + 1,
        }));
      } else {
        // user has not reached claim capacity, increment claim and start regenerating the next claim
        updateDoc(doc(db, 'users', currentUser.uid), {
          nextClaimTime: new Date(
            new Date().getTime() + 60 * 60 * 24 * 1000
          ).toJSON(),
          claimAvailable: userData.claimAvailable + 1,
        });
        setUserData((prevState) => ({
          ...prevState,
          nextClaimTime: new Date(
            new Date().getTime() + 60 * 60 * 24 * 1000
          ).toJSON(),
          claimAvailable: userData.claimAvailable + 1,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function decrementClaims() {
    try {
      const currentTime = new Date().getTime();
      // nextClaimTime will remain as it is, it it's already defined. Else we will set it to be 24hrs from now
      const newNextClaimTime =
        userData.nextClaimTime.length === 0
          ? new Date(currentTime + 60 * 60 * 24 * 1000).toJSON()
          : userData.nextClaimTime;
      updateDoc(doc(db, 'users', currentUser.uid), {
        nextClaimTime: newNextClaimTime,
        claimAvailable: userData.claimAvailable - 1,
      });
      setUserData((prevState) => {
        console.dir({
          ...prevState,
          nextClaimTime: newNextClaimTime,
          claimAvailable: prevState.claimAvailable - 1,
        });

        return {
          ...prevState,
          nextClaimTime: newNextClaimTime,
          claimAvailable: prevState.claimAvailable - 1,
        };
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Container>
      {/* {currentUser && <Text textAlign='center'>Welcome {userData.name}!</Text>} */}
      {currentUser && <Text textAlign='center'>{claimRemainingMessage}</Text>}
      {bigPromotions.map((promotion) => {
        // console.log(
        //   promotion.store + ': ' + shouldDisplay(promotion.releaseTime)
        // );
        // if (shouldDisplay(promotion.releaseTime) === true) {
        //   return <BigPromotion promotion={promotion} key={promotion.id} />;
        // } else {
        //   return '';
        // }

        return (
          <BigPromotion
            promotion={promotion}
            key={promotion.id}
            decrementClaims={decrementClaims}
          />
        );
      })}
    </Container>
  );
};

export default Promotions;
