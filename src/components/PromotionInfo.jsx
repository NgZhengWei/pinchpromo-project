import {
  getDoc,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';
import { storage, db } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const PromotionInfo = (props) => {
  const [promotion, setPromotion] = useState({});
  const [promotionUsed, setPromotionUsed] = useState(false);
  const [posterURL, setPosterURL] = useState('');
  const [couponInUse, setCouponInUse] = useState(false);
  const [timeLeft, setTimeLeft] = useState("Time's Up");
  const [couponTimeUp, setCouponTimeUp] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  const { promotionId } = location.state;

  useEffect(() => {
    async function getPromotion() {
      try {
        // retrive promotion data using promotionId obtained from navigation from UserPromotion Component
        // set promotion data to promotion state
        const promotionPromise = await getDoc(
          doc(db, 'bigPromotions', promotionId)
        );
        setPromotion(promotionPromise.data());

        // retrive user data from FireStore
        // check if promotionId is in user's active promotions and set promotionUsed state
        const userPromise = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userPromise.data();
        setPromotionUsed(!userData.promotions.includes(promotionId));
      } catch (e) {
        console.error(e.message);
      }
    }

    getPromotion();
  }, []);

  // assignment of variables has to come after useEffect as we to wait for data from FireStore before setting variables
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
  } = promotion;

  let startDateString;
  let endDateString;
  // check if promotion state is set. If it is we
  // get download url of the logo and poster images from storage
  // and set date string of start and end date
  if (Object.keys(promotion).length !== 0) {
    const posterStorageRef = ref(storage, pathToPoster);
    getDownloadURL(posterStorageRef).then((url) => {
      setPosterURL(url);
    });

    const startDate = new Date(releaseTime);
    startDateString =
      String(startDate.getDate()) +
      ' ' +
      startDate.toLocaleString('default', { month: 'long' }) +
      ' ' +
      String(startDate.getFullYear());

    const endDate = new Date(endTime);
    endDateString =
      String(endDate.getDate()) +
      ' ' +
      endDate.toLocaleString('default', { month: 'long' }) +
      ' ' +
      String(endDate.getFullYear());
  }

  async function useCouponHandler(e) {
    if (
      window.confirm(
        'Coupon will only be vaild for 5 minutes upon using, please make sure you are at the store before presing "OK". Refreshing the page will make the coupon invalid.'
      ) === true
    ) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          promotions: arrayRemove(promotionId),
          usedPromotions: arrayUnion(promotionId),
        });
        startUsageTimer();
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  function startUsageTimer() {
    setCouponInUse(true);
    // change initial timing to when timing duration is changed
    setTimeLeft('5:00');
    const currentTime = new Date();
    // change timing added to change timer duration
    const endTime = new Date(currentTime.getTime() + 5 * 60000);
    console.log('end time: ' + endTime);

    const interval = window.setInterval(function () {
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft("Time's Up");
        clearInterval(interval);
        setCouponTimeUp(true);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        let secondsString = String(seconds);
        if (secondsString.length === 1) {
          secondsString = '0' + secondsString;
        }
        setTimeLeft(minutes + ':' + secondsString);
      }
    }, 1000);
  }

  return (
    <Flex direction='column' w='90%' m='auto'>
      <Image
        boxSize='100%'
        objectFit='cover'
        src={posterURL}
        mx='auto'
        mb='5px'
      />
      <Heading
        textAlign='center'
        fontSize={{ base: '24px', sm: '28px', md: '32px' }}
        mb='10px'
      >
        {store}
      </Heading>
      <Heading
        textAlign='center'
        fontSize={{ base: '28px', sm: '32px', md: '36px' }}
        mb='15px'
      >
        {title}
      </Heading>
      <Flex
        justifyContent='space-between'
        borderBottom='1px solid'
        borderColor='gray.500'
        mb='15px'
      >
        <Box>
          <Text fontSize={{ base: '13px', sm: '16px' }} color='gray.600'>
            Release date
          </Text>
          <Text fontSize={{ base: '16px', sm: '20px' }}>{startDateString}</Text>
        </Box>
        <Box>
          <Text fontSize={{ base: '13px', sm: '16px' }} color='gray.600'>
            Expiry date
          </Text>
          <Text fontSize={{ base: '16px', sm: '20px' }}>{endDateString}</Text>
        </Box>
      </Flex>
      <Box mb='40px'>
        <Heading as='h3' fontSize={{ base: '20px', sm: '24px', md: '28px' }}>
          Description
        </Heading>
        <Text fontSize={{ base: '13px', sm: '16px' }} mb='15px'>
          {description}
        </Text>
        <Heading as='h3' fontSize={{ base: '20px', sm: '24px', md: '28px' }}>
          Terms & Conditions
        </Heading>
        <Text fontSize={{ base: '13px', sm: '16px' }}>{termsAndCondition}</Text>
      </Box>

      {!couponInUse && (
        <Button
          colorScheme={promotionUsed ? 'blackAlpha' : 'red'}
          variant={promotionUsed ? 'outline' : 'solid'}
          isDisabled={promotionUsed}
          position='relative'
          bottom='0px'
          onClick={useCouponHandler}
          mb='15px'
        >
          {promotionUsed ? 'Used' : 'Use'}
        </Button>
      )}

      {couponInUse && (
        <Card
          backgroundColor={couponTimeUp ? 'red.500' : 'green.400'}
          py='10px'
        >
          <Text textAlign='center'>{timeLeft}</Text>
          {couponTimeUp && (
            <Text textAlign='center'>Thanks for using PinchPromo :)</Text>
          )}
          {!couponTimeUp && <Text textAlign='center'>{promocode}</Text>}
        </Card>
      )}
    </Flex>
  );
};

export default PromotionInfo;
