import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { Container } from '@chakra-ui/react';
import BigPromotion from './BigPromotion';

const Promotions = () => {
  const { currentUser } = useAuth();
  const [bigPromotions, setBigPromotions] = useState([]);

  const bigPromotionsCollectionRef = collection(db, 'bigPromotions');
  const userRef = doc(db, 'users', currentUser.uid);

  useEffect(() => {
    const getBigPromotions = async () => {
      try {
        const userData = await getDoc(userRef);

        const data = await getDocs(bigPromotionsCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          promotions: userData.data().promotions,
        }));
        setBigPromotions(filteredData);
      } catch (e) {
        console.error(e);
      }
    };

    getBigPromotions();
  }, []);

  return (
    <Container>
      <div>Welcome {currentUser.email}!</div>
      {bigPromotions.map((promotion) => {
        return <BigPromotion promotion={promotion} key={promotion.id} />;
      })}
    </Container>
  );
};

export default Promotions;
