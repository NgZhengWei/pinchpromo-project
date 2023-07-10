import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage, db } from '../firebase';
import { AtSignIcon, CheckIcon, LinkIcon, WarningIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const BigPromotionCompanyInfo = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [imgURL, setImgURL] = useState('');
  const [userData, setUserData] = useState({});
  const [promotionIsClaimed, setPromotionIsClaimed] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // consist of promotion data and user data
  const {
    id, //promotion id
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
    aboutBusiness,
    businessWebsite,
    businessSocial,
    promotions: userPromotions, // user data from here on
    usedPromotions,
    claimAvailable,
  } = location.state;

  async function decrementClaims() {
    try {
      const currentTime = new Date().getTime();
      // nextClaimTime will remain as it is, it it's already defined. Else we will set it to be 24hrs from now
      const newNextClaimTime =
        userData.nextClaimTime.length === 0
          ? new Date(currentTime + 60 * 60 * 24 * 1000).toJSON()
          : userData.nextClaimTime;
      updateDoc(doc(db, 'users', currentUser.uid), {
        nextClaimTime: newNextClaimTime,
        claimAvailable: userData.claimAvailable - 1,
      });
    } catch (e) {
      console.error(e);
    }
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
          decrementClaims();
          // BUG here not sure why
          // setClaimAvailableState((prevState) => {
          //   console.log('new state: ' + (prevState - 1));
          //   return prevState - 1;
          // });
          setPromotionIsClaimed(true);
          toast({
            title: 'Successfully claimed coupon',
            description:
              'Here are your claimed promotions. They will be usable after release so be sure to use them before they expire!',
            isClosable: true,
            duration: 10000,
            status: 'success',
            position: 'bottom',
            icon: <CheckIcon />,
          });
          // tmp fix here by redirecting user to another page
          navigate('/mypromotions');
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
          icon: <WarningIcon />,
        });
      }
    } else {
      // if user is not logged in
      navigate('/signup');
    }
  }

  useEffect(() => {
    async function getUserData() {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDataPromise = await getDoc(userRef);

        // checking if user has already claimed this promotion
        if (
          userDataPromise.data().promotions.includes(id) ||
          userDataPromise.data().usedPromotions.includes(id)
        ) {
          setPromotionIsClaimed(true);
        }

        setUserData(userDataPromise.data());
      } catch (e) {
        console.error(e);
      }
    }
    getUserData();

    let imgPath;
    if (new Date() > new Date(releaseTime)) {
      imgPath = pathToPoster;
    } else {
      imgPath = pathToLogo;
    }

    const imgStorageRef = ref(storage, imgPath);
    getDownloadURL(imgStorageRef).then((url) => {
      setImgURL(url);
    });
  }, []);

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

  const remainingCoupons = numberOfCoupons - numberOfCouponsClaimed;
  const accordionHeading = { base: '15px', sm: '16px', md: '20px' };

  return (
    <Container>
      <Flex direction='column' w='90%' m='auto'>
        <Image
          id = 'posterImage'
          boxSize='100%'
          objectFit='cover'
          src={imgURL}
          mx='auto'
          mb='5px'
        />

        <Heading
          textAlign='center'
          fontSize={{ base: '32px', sm: '36px', md: '40px' }}
          mb='10px'
          fontStyle='italic'
          fontWeight='light'
        >
          {store}
        </Heading>

        <Flex
          justifyContent='space-between'
          borderBottom='1px solid'
          borderColor='gray.500'
          mb='15px'
        >
          <Box>
            <Text fontSize={{ base: '11px', sm: '13px' }} color='gray.600'>
              Release date
            </Text>
            <Text fontSize={{ base: '15px', sm: '18px' }}>
              {startDateString}
            </Text>
          </Box>
          <Box>
            <Text fontSize={{ base: '11px', sm: '13px' }} color='gray.600'>
              Expiry date
            </Text>
            <Text fontSize={{ base: '15px', sm: '18px' }}>{endDateString}</Text>
          </Box>
        </Flex>

        <Accordion defaultIndex={[0]} allowMultiple mb='10px'>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading
                    as='h3'
                    fontSize={accordionHeading}
                    fontWeight='normal'
                  >
                    About the business
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text fontSize={{ base: '13px', sm: '16px' }} mb='15px'>
                {aboutBusiness}
              </Text>
              <Flex
                alignItems='center'
                fontSize={{ base: '13px', sm: '16px' }}
                mb='5px'
              >
                <LinkIcon mr='5px' color='blue.400' />
                <Link
                  href={businessWebsite}
                  color='blue.400'
                  target='_blank'
                  rel='noreferrer'
                >
                  Browse products
                </Link>
              </Flex>

              {businessSocial !== undefined && businessSocial.length > 0 && (
                <Flex
                  alignItems='center'
                  fontSize={{ base: '13px', sm: '16px' }}
                >
                  <AtSignIcon mr='5px' color='blue.400' />
                  <Link
                    href={businessSocial}
                    color='blue.400'
                    target='_blank'
                    rel='noreferrer'
                  >
                    Social media
                  </Link>
                </Flex>
              )}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Heading
                    as='h3'
                    fontSize={accordionHeading}
                    fontWeight='normal'
                  >
                    Terms & Conditions
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text fontSize={{ base: '13px', sm: '16px' }}>
                <b>Mandatory Legal Information</b>
              </Text>
              <Text fontSize={{ base: '13px', sm: '16px' }}>
                PinchPromo may or may not have a formal partnership with the
                mentioned brands. However, rest assured that the promotions
                offered through PinchPromo are still valid and genuine.
              </Text>
              <Text fontSize={{ base: '13px', sm: '16px' }}>
                The logos displayed are used for contextual purposes, providing
                a visual representation of the brands for which PinchPromo
                offers promotions. Get ready to enjoy fantastic savings through
                PinchPromo, where our team works tirelessly to bring you the
                best deals available.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Text mb='40px' fontSize={{ base: '11px', sm: '13px' }}>
          Note: Important legal information in T&C.
        </Text>

        <Button
          id = 'bigPromoClaimButton'
          colorScheme='red'
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
    </Container>
  );
};

export default BigPromotionCompanyInfo;
