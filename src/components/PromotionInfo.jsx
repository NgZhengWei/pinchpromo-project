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
import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const PromotionInfo = (props) => {
  const [promotion, setPromotion] = useState({});
  const [posterURL, setPosterURL] = useState('');
  const { currentUser } = useAuth();
  const location = useLocation();
  console.dir(location);

  const promotionId = location.state.promotionId;

  useEffect(() => {
    async function getPromotion() {
      const promotionPromise = await getDoc(
        doc(db, 'bigPromotions', promotionId)
      );
      setPromotion(promotionPromise.data());
    }

    getPromotion();
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

  let startDateString;
  let endDateString;
  // getting download url of the logo and poster images from storage
  if (Object.keys(promotion).length !== 0) {
    const posterStorageRef = ref(storage, pathToPoster);
    getDownloadURL(posterStorageRef).then((url) => {
      setPosterURL(url);
    });

    const startDate = new Date(releaseTime);
    startDateString =
      String(startDate.getDay()) +
      ' ' +
      startDate.toLocaleString('default', { month: 'long' }) +
      ' ' +
      String(startDate.getFullYear());

    const endDate = new Date(endTime);
    endDateString =
      String(endDate.getDay()) +
      ' ' +
      endDate.toLocaleString('default', { month: 'long' }) +
      ' ' +
      String(endDate.getFullYear());
  }

  async function useCouponHandler(e) {
    if (
      window.confirm(
        'Coupon will only be vaild for 5 minutes upon using, please make sure you are at the store before presing "ok"'
      ) === true
    ) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          promotions: arrayRemove(promotionId),
          usedPromotions: arrayUnion(promotionId),
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <Flex direction='column' w='90%' m='auto'>
      <Image
        boxSize='100%'
        objectFit='cover'
        src={posterURL}
        mx='auto'
        mb='15px'
      />
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

      <Button
        colorScheme='red'
        position='relative'
        bottom='0px'
        onClick={useCouponHandler}
      >
        Use
      </Button>
    </Flex>
  );
};

export default PromotionInfo;
