import { Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage, db } from '../firebase';
import { useEffect, useState } from 'react';
import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BigPromotion = (props) => {
  const { currentUser } = useAuth();
  // const posterStorageRef = ref(storage, pathToPoster);
  const [logoURL, setLogoURL] = useState('');
  // const [posterURL, setPosterURL] = useState();
  const [promotion, setPromotion] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function getPromotionData() {
      const promotionPromise = await getDoc(
        doc(db, 'bigPromotions', props.promotionId)
      );
      setPromotion(promotionPromise.data());
    }
    getPromotionData();

    // getDownloadURL(posterStorageRef).then((url) => {
    //   setPosterURL(url);
    // });
  }, []);

  const {
    id,
    store,
    title,
    promocode,
    description,
    releaseTime,
    endTime,
    pathToLogo,
    pathToPoster,
    termsAndCondition,
    numberOfCoupons,
    numberOfCouponsClaimed,
    promotions: userPromotions,
  } = promotion;

  // getting download url of the logo and poster images from storage
  if (Object.keys(promotion).length !== 0) {
    const logoStorageRef = ref(storage, pathToLogo);
    getDownloadURL(logoStorageRef).then((url) => {
      setLogoURL(url);
    });
  }

  const startDate = new Date(releaseTime);
  const dateString =
    String(startDate.getDay()) +
    ' ' +
    startDate.toLocaleString('default', { month: 'long' }) +
    ' ' +
    String(startDate.getFullYear());

  async function useClickHandler(e) {
    navigate('/promotioninfo', { state: { promotionId: props.promotionId } });
    // try {
    //   await updateDoc(doc(db, 'users', currentUser.uid), {
    //     promotions: arrayUnion(id),
    //   });
    //   await updateDoc(doc(db, 'bigPromotions', id), {
    //     numberOfCouponsClaimed: numberOfCouponsClaimed + 1,
    //   });
    // } catch (e) {
    //   console.error(e);
    // }
  }

  return (
    <Flex p='20px' borderBottom='1px solid' borderColor='gray.400'>
      <Image
        boxSize={{ base: '90px', sm: '100px', md: '100px' }}
        src={logoURL}
        alt={store + ' logo'}
        objectFit='cover'
        mr='15px'
      />

      <Flex direction='column' w='100%'>
        <Text
          fontSize={{ base: '11px', sm: '12px', md: '16px' }}
          color='gray.600'
        >
          {dateString}
        </Text>
        <Flex justifyContent='space-between' alignItems='center'>
          <Heading as='h4' fontSize={{ base: '20px', sm: '24px', md: '28px' }}>
            {store}
          </Heading>
          <Text
            fontSize={{ base: '11px', sm: '12px', md: '16px' }}
            color='gray.600'
          >
            coupons remaining
          </Text>
        </Flex>
        <Text fontSize={{ base: '13px', sm: '16px' }} mt='5px' mb='10px'>
          {description}
        </Text>
        <Button
          colorScheme='red'
          size='xs'
          w='min-content'
          p='12px'
          onClick={useClickHandler}
        >
          Use
        </Button>
      </Flex>
    </Flex>
  );
};

export default BigPromotion;
