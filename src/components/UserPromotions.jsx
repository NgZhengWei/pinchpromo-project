import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { Container, Text } from '@chakra-ui/react';
import UserPromotion from './UserPromotion';

const UserPromotions = () => {
  const { currentUser } = useAuth();
  // const [bigPromotions, setBigPromotions] = useState([]);
  const [userActivePromotions, setUserActivePromotions] = useState([]);
  const [userUsedPromotions, setUserUsedPromotions] = useState([]);

  const userRef = doc(db, 'users', currentUser.uid);

  useEffect(() => {
    const getBigPromotions = async () => {
      try {
        const userDataPromise = await getDoc(userRef);
        const userData = userDataPromise.data();
        setUserActivePromotions(userData.promotions);
      } catch (e) {
        console.error(e);
      }
    };

    getBigPromotions();
  }, []);

  return (
    <Container>
      <div>Welcome {currentUser.email}!</div>
      {userActivePromotions.map((promotionId) => (
        <UserPromotion key={promotionId} promotionId={promotionId} />
      ))}
    </Container>
  );
};

export default UserPromotions;
