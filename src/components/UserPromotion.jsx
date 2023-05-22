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

  // input: date object as input
  // return: day difference rounded up to nearest int (date1 - date2)
  // if return is -ve means day has passed
  function getDayDifference(date1, date2) {
    const diffTime = date1 - date2;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // output: true if coupon is expiring within 3 days, false otherwise
  function isExpiring() {
    const dayDiff = getDayDifference(new Date(endTime), new Date());
    // check for -0 is to account for expiry date bring the day before, in which case it should return false
    return dayDiff !== -0 && dayDiff >= 0 && dayDiff <= 3;
  }

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

  const endDate = new Date(endTime);
  const dateString =
    String(endDate.getDate()) +
    ' ' +
    endDate.toLocaleString('default', { month: 'long' }) +
    ' ' +
    String(endDate.getFullYear());

  async function useClickHandler(e) {
    navigate('/promotioninfo', {
      state: { promotionId: props.promotionId, used: props.used },
    });
  }

  const smallFontSize = { base: '11px', sm: '12px', md: '16px' };
  const bodyFontSize = { base: '13px', sm: '16px' };

  return (
    <Flex p='20px' borderBottom='1px solid' borderColor='gray.400'>
      <Image
        boxSize={{ base: '90px', sm: '100px', md: '100px' }}
        src={logoURL}
        alt={store + ' logo'}
        objectFit='cover'
        mr='15px'
        my='auto'
      />

      <Flex direction='column' w='100%'>
        <Text
          fontSize={smallFontSize}
          color={isExpiring() && !props.used ? 'red' : 'gray.600'}
        >
          {'Expires ' + dateString}
        </Text>
        <Flex justifyContent='space-between' alignItems='center'>
          <Heading as='h4' fontSize={{ base: '20px', sm: '24px', md: '28px' }}>
            {store}
          </Heading>
        </Flex>
        <Text fontSize={bodyFontSize} mt='5px' mb='10px'>
          {description}
        </Text>
        <Button
          colorScheme={props.used ? 'blackAlpha' : 'red'}
          variant={props.used ? 'outline' : 'solid'}
          size='xs'
          w='min-content'
          p='15px'
          onClick={useClickHandler}
          fontSize={bodyFontSize}
        >
          {props.used ? 'See more' : 'Use'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default BigPromotion;
