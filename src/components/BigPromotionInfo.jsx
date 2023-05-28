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
  Flex,
  Heading,
  Image,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { CheckIcon } from '@chakra-ui/icons';

const PromotionInfo = (props) => {
  const location = useLocation();
  // initialised promotion data obtained from BigPromotion
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
  } = location.state.promotionData;

  const [promotion, setPromotion] = useState({});
  const [posterURL, setPosterURL] = useState('');
  const [promotionIsClaimed, setPromotionIsClaimed] = useState(
    location.state.promotionIsClaimed
  );
  const [numberOfCouponsClaimedState, setNumberOfCouponsClaimedState] =
    useState(numberOfCouponsClaimed);
  const { currentUser } = useAuth();
  const toast = useToast();

  const remainingCoupons = numberOfCoupons - numberOfCouponsClaimedState;
  let remainingCouponsString;
  if (remainingCoupons === 0) {
    remainingCouponsString = 'Coupons all claimed';
  } else {
    remainingCouponsString = String(remainingCoupons) + ' coupons remaining';
  }

  const headingFontSize = { base: '20px', sm: '24px', md: '28px' };
  const bodyFontSize = { base: '13px', sm: '16px' };

  useEffect(() => {
    // async function getPromotion() {
    //   const promotionPromise = await getDoc(doc(db, 'bigPromotions', id));
    //   const promotion = promotionPromise.data();
    //   setPromotion(promotionPromise.data());
    // }

    // getting download url of the poster images from storage
    const posterStorageRef = ref(storage, pathToPoster);
    getDownloadURL(posterStorageRef).then((url) => {
      setPosterURL(url);
    });
  }, []);

  // setting date string formatting (can be modularised)
  let startDateString;
  let endDateString;
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

  async function claimClickHandler(e) {
    try {
      // add promotion id to list of promotions user has
      await updateDoc(doc(db, 'users', currentUser.uid), {
        promotions: arrayUnion(id),
      });

      // increase the number of coupons claimed by 1
      await updateDoc(doc(db, 'bigPromotions', id), {
        numberOfCouponsClaimed: numberOfCouponsClaimed + 1,
      });
      setNumberOfCouponsClaimedState(numberOfCouponsClaimed + 1);
      setPromotionIsClaimed(true);
      toast({
        title: 'Claimed',
        description: 'Successfully claimed coupon',
        isClosable: true,
        duration: 3000,
        status: 'success',
        position: 'top',
        icon: <CheckIcon />,
      });
    } catch (e) {
      console.error(e);
    }
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
      >
        {title}
      </Heading>
      <Text textAlign='center' mb='10px' fontSize={bodyFontSize} color='red'>
        {remainingCouponsString}
      </Text>
      <Flex
        justifyContent='space-between'
        borderBottom='1px solid'
        borderColor='gray.500'
        mb='15px'
      >
        <Box>
          <Text fontSize={bodyFontSize} color='gray.600'>
            Release date
          </Text>
          <Text fontSize={{ base: '16px', sm: '20px' }}>{startDateString}</Text>
        </Box>
        <Box>
          <Text fontSize={bodyFontSize} color='gray.600'>
            Expiry date
          </Text>
          <Text fontSize={{ base: '16px', sm: '20px' }}>{endDateString}</Text>
        </Box>
      </Flex>
      <Box mb='40px'>
        <Heading as='h3' fontSize={headingFontSize}>
          Description
        </Heading>
        <Text fontSize={bodyFontSize} mb='15px'>
          {description}
        </Text>
        <Heading as='h3' fontSize={headingFontSize}>
          Terms & Conditions
        </Heading>
        <Text fontSize={bodyFontSize}>{termsAndCondition}</Text>
      </Box>

      <Button
        colorScheme='red'
        pt='2px'
        mb='20px'
        onClick={claimClickHandler}
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
  );
};

export default PromotionInfo;
