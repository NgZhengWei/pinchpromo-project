import {
    Alert,
    AlertIcon,
    AlertTitle,
    Button,
    Card,
    CardBody,
    CardHeader,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Text,
  } from '@chakra-ui/react';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  import { useEffect, useRef, useState } from 'react';
  import { Form } from 'react-router-dom';
  import { db, storage } from '../firebase';
  import { useAuth } from '../contexts/AuthContext';
  import { ref, uploadBytes } from 'firebase/storage';
  
  const ReceiptClaim = () => {
    const [loading, setLoading] = useState(false);
    const promotionRef = useRef();
    const receiptRef = useRef();
    const phoneNumberRef = useRef();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userPromotions, setUserPromotions] = useState([]);
    const [userData, setUserData] = useState([]);
    const { currentUser } = useAuth();
  
    useEffect(() => {
      async function getData() {
        getDoc(doc(db, 'users', currentUser.uid))
          .then((document) => {
            const userData = document.data();
            setUserData(userData);
            const promises = [];
  
            // get only the promotions the user has
            userData.promotions.forEach((promoId) => {
              promises.push(getDoc(doc(db, 'bigPromotions', promoId)));
            });
  
            userData.usedPromotions.forEach((promoId) => {
              promises.push(getDoc(doc(db, 'bigPromotions', promoId)));
            });
  
            Promise.all(promises)
              .then((promos) => {
                const p = [];
                promos.forEach((docSnap) =>
                  p.push({ ...docSnap.data(), id: docSnap.id })
                );
                setUserPromotions(p);
              })
              .catch((e) => {
                console.error(e);
              });
          })
          .catch((e) => {
            console.error(e);
          });
      }
  
      getData();
    }, []);
  
    async function handleSumit(e) {
      e.preventDefault();
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        // save logo and poster to storage first
        const entryName =
          userData.name +
          '-' +
          promotionRef.current.value +
          '-' +
          String(new Date().getTime());
        const receiptPath = 'images/receiptClaims/' + entryName;
  
        const logoStorageRef = ref(storage, receiptPath);
  
        if (receiptRef.current.files[0]) {
          console.log('dawd');
          uploadBytes(logoStorageRef, receiptRef.current.files[0]);
        } else {
          setError('Receipt image cannot be empty');
        }
        // Adding using store name as document id
  
        await setDoc(doc(db, 'receiptClaims', entryName), {
          userId: currentUser.uid,
          promotionId: promotionRef.current.value,
          pathToReceipt: receiptPath,
          paid: false,
          rejected: false,
          checked: false,
          timeStamp: new Date().toLocaleString(),
          phoneNumber: phoneNumberRef.current.value,
        });
        setSuccess('Successfully added receipt claim.');
  
        phoneNumberRef.current.value = '';
        promotionRef.current.value = '';
        receiptRef.current.value = '';
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
      setLoading(false);
    }
  
    const headingFontSize = { base: '24px', sm: '24px', md: '28px' };
  
    return (
      <Container>
        {error && (
          <Alert status='error' variant='left-accent' borderRadius={4} mb='10px'>
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        {success && (
          <Alert
            status='success'
            variant='left-accent'
            borderRadius={4}
            mb='10px'
          >
            <AlertIcon />
            <AlertTitle>{success}</AlertTitle>
          </Alert>
        )}
        <Card mb='30px'>
          <CardBody>
            <Heading mb='10px' fontSize={headingFontSize}>
              Receipt Upload Form
            </Heading>
            <Text mb='10px'>
              This is for promos where you get cashback for uploading your
              receipt!
            </Text>
            <Text>Happy Pinching Promos 🤗</Text>
          </CardBody>
        </Card>
        <Form onSubmit={handleSumit}>
          <FormControl mb='20px' isRequired>
            <FormLabel>Promotion To Claim For</FormLabel>
            <Select id ='ReceiptClaimFormSelectInput' placeholder='Select' ref={promotionRef}>
              {userPromotions.map((p) => {
                return (
                  <option value={p.id} key={p.id}>
                    {p.store}
                  </option>
                );
              })}
            </Select>
          </FormControl>
  
          <FormControl mb='20px' isRequired>
            <FormLabel>Paynow/PayLah Number</FormLabel>
            <Input id ='ReceiptClaimPhoneNumInput' type='number' name='phoneNumber' ref={phoneNumberRef} />
          </FormControl>
  
          <FormControl mb='20px' isRequired>
            <FormLabel>Receipt Image</FormLabel>
            <Input id ='ReceiptClaimReceiptImageInput' type='file' name='receipt' ref={receiptRef} />
          </FormControl>
  
          <Button id ='ReceiptClaimButtonInput'disabled={loading} type='submit' w='100%' colorScheme='red'>
            Submit Claim
          </Button>
        </Form>
      </Container>
    );
  };
  
  export default ReceiptClaim;
  