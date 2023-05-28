import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { Container } from '@chakra-ui/react';
import BigPromotion from './BigPromotion';

const Promotions = () => {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState('');
  const [bigPromotions, setBigPromotions] = useState([]);

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
        let filteredData;
        const data = await getDocs(bigPromotionsCollectionRef);

        if (currentUser) {
          const userData = await getDoc(userRef);
          setUsername(userData.data().name);

          filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            promotions: userData.data().promotions,
            usedPromotions: userData.data().usedPromotions,
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

  return (
    <Container>
      <div>Welcome {username}!</div>
      {bigPromotions.map((promotion) => {
        // console.log(
        //   promotion.store + ': ' + shouldDisplay(promotion.releaseTime)
        // );
        // if (shouldDisplay(promotion.releaseTime) === true) {
        //   return <BigPromotion promotion={promotion} key={promotion.id} />;
        // } else {
        //   return '';
        // }

        return <BigPromotion promotion={promotion} key={promotion.id} />;
      })}
    </Container>
  );
};

export default Promotions;
