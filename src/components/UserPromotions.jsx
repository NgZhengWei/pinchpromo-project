import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { Container, Heading, Text } from '@chakra-ui/react';
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
        setUserUsedPromotions(userData.usedPromotions);
      } catch (e) {
        console.error(e);
      }
    };

    getBigPromotions();
  }, []);

  const headingFontSize = { base: '28px', sm: '32px', md: '36px' };

  return (
    <Container>
      <Heading as='h2' mt='10px' textAlign='center' fontSize={headingFontSize}>
        Active Promotions
      </Heading>
      {userActivePromotions.map((promotionId) => (
        <UserPromotion
          key={promotionId}
          promotionId={promotionId}
          used={false}
        />
      ))}
      <Heading as='h2' mt='60px' textAlign='center' fontSize={headingFontSize}>
        Used Promotions
      </Heading>
      {userUsedPromotions.map((promotionId) => (
        <UserPromotion
          key={promotionId}
          promotionId={promotionId}
          used={true}
        />
      ))}
    </Container>
  );
};

export default UserPromotions;
