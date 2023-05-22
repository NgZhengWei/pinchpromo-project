import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Container, Heading, Text } from '@chakra-ui/react';
import UserPromotion from './UserPromotion';

const UserPromotions = () => {
  const { currentUser } = useAuth();
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
  const bodyFontSize = { base: '13px', sm: '16px' };

  return (
    <Container>
      <Heading as='h2' mb='8px' textAlign='center' fontSize={headingFontSize}>
        Active Promotions
      </Heading>
      {userActivePromotions.length <= 0 && (
        <Text textAlign='center' fontSize={bodyFontSize}>
          No promotions yet. Keep an eye on the promos tab for when new
          promotions are released!
        </Text>
      )}
      {userActivePromotions.map((promotionId) => (
        <UserPromotion
          key={promotionId}
          promotionId={promotionId}
          used={false}
        />
      ))}
      {userUsedPromotions.length > 0 && (
        <Heading
          as='h2'
          mt='60px'
          textAlign='center'
          fontSize={headingFontSize}
        >
          Used Promotions
        </Heading>
      )}
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
