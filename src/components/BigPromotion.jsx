import { Button, Flex, Heading, Image, Link, Text } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage, db } from '../firebase';
import { useEffect, useState } from 'react';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const BigPromotion = (props) => {
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
    usedPromotions,
  } = props.promotion;

  const { currentUser } = useAuth();
  const logoStorageRef = ref(storage, pathToLogo);
  // const posterStorageRef = ref(storage, pathToPoster);
  const [logoURL, setLogoURL] = useState();
  // const [posterURL, setPosterURL] = useState();
  const [promotionIsClaimed, setPromotionIsClaimed] = useState(false);
  const [numberOfCouponsClaimedState, setNumberOfCouponsClaimedState] =
    useState(numberOfCouponsClaimed);
  const navigate = useNavigate();

  useEffect(() => {
    // getting download url of the logo and poster images from storage
    getDownloadURL(logoStorageRef).then((url) => {
      setLogoURL(url);
    });
    // getDownloadURL(posterStorageRef).then((url) => {
    //   setPosterURL(url);
    // });

    // checking if user has already claimed this promotion
    if (userPromotions) {
      if (userPromotions.includes(id) || usedPromotions.includes(id)) {
        setPromotionIsClaimed(true);
      }
    }
  }, []);

  const startDate = new Date(releaseTime);
  const dateString =
    String(startDate.getDate()) +
    ' ' +
    startDate.toLocaleString('default', { month: 'long' }) +
    ' ' +
    String(startDate.getFullYear());

  const remainingCoupons = numberOfCoupons - numberOfCouponsClaimedState;
  let remainingCouponsString;
  if (remainingCoupons === 0) {
    remainingCouponsString = '';
  } else {
    remainingCouponsString = String(remainingCoupons) + ' remaining';
  }

  async function claimClickHandler(e) {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        promotions: arrayUnion(id),
      });
      await updateDoc(doc(db, 'bigPromotions', id), {
        numberOfCouponsClaimed: numberOfCouponsClaimed + 1,
      });
      setNumberOfCouponsClaimedState(numberOfCouponsClaimed + 1);
      setPromotionIsClaimed(true);
    } catch (e) {
      console.error(e);
    }
  }

  function seeMoreClickHandler(e) {
    navigate('/bigpromotioninfo', {
      state: {
        promotionData: props.promotion,
        promotionIsClaimed: promotionIsClaimed,
      },
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
        <Text fontSize={smallFontSize} color='gray.600'>
          {dateString}
        </Text>
        <Flex justifyContent='space-between' alignItems='center'>
          <Heading as='h4' fontSize={{ base: '20px', sm: '24px', md: '28px' }}>
            {store}
          </Heading>
          <Text fontSize={smallFontSize} color='gray.600'>
            {remainingCouponsString}
          </Text>
        </Flex>
        <Text fontSize={bodyFontSize} mt='5px' mb='3px'>
          {description}
        </Text>

        <Button
          colorScheme='red'
          size='xs'
          w='min-content'
          p='15px'
          onClick={seeMoreClickHandler}
          fontSize={bodyFontSize}
          isDisabled={remainingCoupons <= 0 || promotionIsClaimed}
          _disabled={{
            backgroundColor: 'gray.400',
            opacity: '0.4',
            cursor: 'not-allowed',
          }}
          _hover={{
            opacity: '0.7',
          }}
        >
          {promotionIsClaimed
            ? 'Claimed'
            : remainingCoupons <= 0
            ? 'Fully Claimed'
            : 'Claim'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default BigPromotion;
