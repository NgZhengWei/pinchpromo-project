import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { storage, db } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  Accordion,
  AccordionPanel,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Link,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { AtSignIcon, LinkIcon } from '@chakra-ui/icons';

const PromotionInfo = (props) => {
  const location = useLocation();
  const { promotion: promotionData } = location.state;
  const [promotion, setPromotion] = useState(promotionData);
  const [userData, setUserData] = useState(promotionData);
  const [promotionUsed, setPromotionUsed] = useState(false);
  const [posterURL, setPosterURL] = useState('');
  const [couponInUse, setCouponInUse] = useState(false);
  const [timeLeft, setTimeLeft] = useState("Time's Up");
  const [couponTimeUp, setCouponTimeUp] = useState(false);
  const { currentUser } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // assignment of variables has to come after useEffect as we to wait for data from FireStore before setting variables
  const {
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
    businessWebsite,
    businessSocial,
    aboutBusiness,
    claimMethod,
  } = promotionData;

  useEffect(() => {
    document.title = 'User Promotion Info';

    async function getUserData() {
      const userPromise = await getDoc(doc(db, 'users', currentUser.uid));
      setUserData(userPromise.data());

      // check if promotion is in user's used promo
      // makes sure that the usage is always in sync with db (otherwise refreshing will allow user to use it again)
      if (
        userPromise.data().usedPromotions.includes(location.state.promotionId)
      ) {
        setPromotionUsed(true);
      }
    }

    getUserData();
  }, []);

  useEffect(() => {
    const posterStorageRef = ref(storage, pathToPoster);
    getDownloadURL(posterStorageRef).then((url) => {
      setPosterURL(url);
    });
  }, [promotion]);

  // check if promotion state is set. If it is we
  // get download url of the logo and poster images from storage
  // and set date string of start and end date
  const startDate = new Date(releaseTime);
  const startDateString =
    String(startDate.getDate()) +
    ' ' +
    startDate.toLocaleString('default', { month: 'long' }) +
    ' ' +
    String(startDate.getFullYear());

  const endDate = new Date(endTime);
  const endDateString =
    String(endDate.getDate()) +
    ' ' +
    endDate.toLocaleString('default', { month: 'long' }) +
    ' ' +
    String(endDate.getFullYear());

  async function useCouponHandler(e) {
    // opens modal upon coupon use
    onOpen();
  }

  function activateCouponClickHandler(e) {
    // start timer and setCouponInUse state to true
    startUsageTimer();

    // update firestore on usage of coupon
    updateDocUseCoupon();

    // show that promotion has been used
    setPromotionUsed(true);

    onClose();
  }

  async function updateDocUseCoupon() {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        promotions: arrayRemove(location.state.promotionId),
        usedPromotions: arrayUnion(location.state.promotionId),
      });
    } catch (e) {
      console.error(e.message);
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

  const accordionHeading = { base: '15px', sm: '16px', md: '20px' };

  // sets the stylinng for button to allow users to differentiate between claim types easily
  let buttonDetails;
  if (claimMethod === 'receiptupload') {
    buttonDetails = {
      colorScheme: 'telegram',
      text: 'Upload Receipt After Purchase',
    };
  } else if (claimMethod === 'website') {
    buttonDetails = {
      colorScheme: 'orange',
      text: 'Get Promocode For Website Use',
    };
  } else if (claimMethod === 'instore') {
    buttonDetails = {
      colorScheme: 'green',
      text: 'Use Promocode In Store',
    };
  } else {
    buttonDetails = {
      colorScheme: 'red',
      text: 'Use',
    };
  }

  return (
    <Container>
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
          fontStyle='italic'
          fontWeight='light'
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
                    [Important] How to use
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text fontSize={{ base: '13px', sm: '16px' }} mb='15px'>
                {description}
              </Text>

              <Flex alignItems='center' fontSize={{ base: '13px', sm: '16px' }}>
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

              {businessSocial && businessSocial.length > 0 && (
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
                    About Business
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text fontSize={{ base: '13px', sm: '16px' }} mb='10px'>
                {aboutBusiness}
              </Text>
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
              <Text fontSize={{ base: '13px', sm: '16px' }} mb='10px'>
                {termsAndCondition}
              </Text>
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
          Note: Legal information in T&C.
        </Text>

        {!couponInUse && (
          <Button id = 'claimingButton'
            colorScheme={
              promotionUsed ? 'blackAlpha' : buttonDetails.colorScheme
            }
            variant={promotionUsed ? 'outline' : 'solid'}
            isDisabled={promotionUsed}
            position='relative'
            onClick={useCouponHandler}
            mb='20px'
            py='30px'
            boxShadow='2xl'
          >
            {promotionUsed ? 'Used' : buttonDetails.text}
          </Button>
        )}

        {couponInUse && (
          <Card
            backgroundColor={couponTimeUp ? 'red.500' : 'green.400'}
            mb='20px'
            display='flex'
            justifyContent='top'
            alignItems='center'
            variant='outline'
          >
            <Box w='fit-content' m='20px'>
              <Box>
                {couponTimeUp ? (
                  ''
                ) : (
                  <Text fontSize={{ base: '12px', sm: '13px' }}>
                    Time remaining:
                  </Text>
                )}
                <Text fontSize={{ base: '28px', sm: '30px' }}>
                  <b>{timeLeft}</b>
                </Text>
              </Box>

              {couponTimeUp && (
                <Text fontSize={{ base: '12px', sm: '13px' }}>
                  Thanks for using PinchPromo :)
                </Text>
              )}
              {!couponTimeUp && (
                <Box>
                  <Text fontSize={{ base: '12px', sm: '13px' }}>
                    Promocode:
                  </Text>
                  <Text fontSize={{ base: '28px', sm: '28px' }}>
                    {promocode}
                  </Text>
                </Box>
              )}
            </Box>
          </Card>
        )}
      </Flex>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Note: Before Using Coupon</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              A <b>5 min countdown</b> will start upon clicking "Confirm Use".
              Please make sure you are ready to pay/checkout before confirming
              usage.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button id = 'confirmUseButton'
              backgroundColor='brandYellow.100'
              _focus={{ backgroundColor: 'brandYellow.200', color: 'white' }}
              mr={3}
              onClick={activateCouponClickHandler}
            >
              Confirm Use
            </Button>
            <Button id = 'cancelButton' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default PromotionInfo;
