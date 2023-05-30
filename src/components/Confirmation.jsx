import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { BellIcon } from '@chakra-ui/icons';

const Confirmation = () => {
  const codeRef = useRef();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const toast = useToast();

  function resendEmailClickHandler(e) {
    console.log('RESEND EMAIL');
  }

  function confirmClickHandler(e) {
    e.preventDefault();

    if (codeRef.current.value === String(userData.confirmationCode)) {
      try {
        updateDoc(doc(db, 'users', currentUser.uid), {
          isEmailConfirmed: true,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      toast({
        title: 'Confirmation Code Invalid',
        description: 'Please check your email for the confirmation code.',
        isClosable: true,
        duration: 3000,
        status: 'error',
        position: 'top',
        icon: <BellIcon />,
      });
    }
  }

  useEffect(() => {
    async function getUserDoc() {
      const userDataPromise = await getDoc(doc(db, 'users', currentUser.uid));
      setUserData(userDataPromise.data());
    }

    getUserDoc();
  }, []);

  return (
    <>
      <Card w='90%' mx='auto'>
        <CardHeader>
          <Heading textAlign='center' mb='10px'>
            Confirm Your Email
          </Heading>
          <Text textAlign='center'>
            Please check your email address for the confirmation code.
          </Text>
        </CardHeader>
        <CardBody
          pt='0px'
          display='flex'
          flexDirection='column'
          justifyContent='center'
        >
          <Input type='text' placeholder='Enter code here' ref={codeRef} />
          <Button
            mx='auto'
            mt='20px'
            w='100%'
            colorScheme='red'
            onClick={confirmClickHandler}
          >
            Confirm
          </Button>
        </CardBody>
      </Card>
      <Text w='90%' mx='auto' mt='10px' textAlign='center'>
        Did not get the email? Click{' '}
        <Link color='blue.400' onClick={resendEmailClickHandler}>
          here
        </Link>{' '}
        to resend.
      </Text>
    </>
  );
};

export default Confirmation;
