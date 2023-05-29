import { Button, Flex, Heading, Image, Text, useToast } from '@chakra-ui/react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage, db } from '../firebase';
import { useEffect, useState } from 'react';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '@chakra-ui/icons';

const BigPromotion = (props) => {
  // input: date object as input
  // return: day difference rounded up to nearest int (date1 - date2)
  // if return is -ve means day has passed
  function getDayDifference(date1, date2) {
    const diffTime = date1 - date2;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // consist of promotion data and user data
  const {
    id,
    store,
    title,
    promocode,
    description,
    releaseTime,
    initTime,
    endTime,
    pathToLogo,
    pathToPoster,
    termsAndCondition,
    numberOfCoupons,
    numberOfCouponsClaimed,
    timestampClaim,
    promotions: userPromotions, // user data from here on
    usedPromotions,
    claimAvailable,
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
  const toast = useToast();

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

  let showDescription = false;
  if (new Date() > new Date(releaseTime)) {
    showDescription = true;
  }

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

  function seeMoreClickHandler(e) {
    navigate('/bigpromotioninfo', {
      state: {
        promotionData: props.promotion,
        promotionIsClaimed: promotionIsClaimed,
      },
    });
  }

  async function claimClickHandler(e) {
    if (currentUser) {
      // if user is logged in

      if (claimAvailable > 0) {
        // if user is logged in and has claim tickets
        try {
          // add promotion id to list of promotions user has
          await updateDoc(doc(db, 'users', currentUser.uid), {
            promotions: arrayUnion(id),
          });

          const currentTime = new Date().toJSON();
          // increase the number of coupons claimed by 1
          await updateDoc(doc(db, 'bigPromotions', id), {
            numberOfCouponsClaimed: numberOfCouponsClaimed + 1,
            timestampClaim: {
              ...timestampClaim,
              [currentTime]: currentUser.uid,
            },
          });
          props.decrementClaims();
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
      } else {
        // if user is logged in and has no claim tickets
        toast({
          title: 'Oops',
          description:
            'Wait till your claim recharges to claim another promotion.',
          isClosable: true,
          duration: 5000,
          status: 'info',
          position: 'top',
          icon: <CheckIcon />,
        });
      }
    } else {
      // if user is not logged in
      navigate('/login');
    }
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
        <Flex justifyContent='space-between' alignItems='center' mb='3px'>
          <Text fontSize={smallFontSize} color='gray.600'>
            {dateString}
          </Text>
          <Text fontSize={smallFontSize} color='gray.600'>
            {remainingCouponsString}
          </Text>
        </Flex>

        <Heading
          as='h4'
          fontSize={{ base: '24px', sm: '24px', md: '28px' }}
          mb='5px'
        >
          {store}
        </Heading>

        {showDescription && (
          <Text fontSize={bodyFontSize} mt='5px' mb='10px'>
            {description}
          </Text>
        )}

        {!showDescription && (
          <>
            <Text fontSize={bodyFontSize}>
              Details will be released in{' '}
              <b>{getDayDifference(new Date(releaseTime), new Date())} days.</b>
            </Text>
            <Text fontSize={bodyFontSize} mb='5px'>
              Claim yours now to secure it.
            </Text>
          </>
        )}

        <Button
          colorScheme='red'
          size='xs'
          w='min-content'
          p='15px'
          onClick={claimClickHandler}
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
