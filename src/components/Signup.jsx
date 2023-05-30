import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { Form, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { CheckIcon } from '@chakra-ui/icons';
import { render } from '@react-email/render';
import { ServerClient } from 'postmark';
import AccountConfirmationEmail from '../emailTemplate/AccountConfirmationEmail';

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState(
    generateConfirmationCode()
  );
  const navigate = useNavigate();
  const toast = useToast();
  const client = new ServerClient(process.env.REACT_APP_POSTMARK_API_KEY);

  function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  function sendConfirmationCodeEmail() {
    const emailHtml = render(
      <AccountConfirmationEmail validationCode={confirmationCode} />
    );

    const options = {
      From: 'hello@pinchpromo.com',
      To: 'test@blackhole.postmarkapp.com', //emailRef.current.value,
      Subject: '[PinchPromo] Email Confirmation Code',
      HtmlBody: emailHtml,
      MessageStream: 'email-confirmation',
      ReplyTo: 'hello@pinchpromo.com',
    };

    client.sendEmail(options);
  }

  async function makeNewUser(user) {
    // console.dir(user);
    // console.log(user.email);
    // console.log(user.uid);

    await setDoc(doc(db, 'users', user.uid), {
      name: nameRef.current.value,
      email: emailRef.current.value,
      promotions: [],
      usedPromotions: [],
      claimAvailable: 1,
      claimCapacity: 1,
      nextClaimTime: '',
      confirmationCode: confirmationCode,
      isEmailConfirmed: false,
    });
  }

  async function handleSumit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value).then(
        (userCredentials) => {
          // console.dir(userCredentials);
          makeNewUser(userCredentials.user);
        }
      );
      toast({
        title: 'Welcome to PinchPromo',
        description:
          'Here are the available promotions. You get to claim one promo per day so choose wisely and check back daily for exclusive SUTD promos!',
        isClosable: true,
        duration: 10000,
        status: 'success',
        position: 'top',
        icon: <CheckIcon />,
      });
      sendConfirmationCodeEmail();
      navigate('/confirmation');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else if (e.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (e.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(e.message);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    sendConfirmationCodeEmail();
  }, []);

  return (
    <Box
      display='flex'
      w='90%'
      mx='auto'
      maxW='800px'
      flexDir='column'
      alignItems='center'
    >
      <Card w='100%' mb='20px'>
        <CardHeader
          fontFamily='Arial Rounded MT Bold'
          textAlign='center'
          fontSize='30px'
        >
          Sign Up
        </CardHeader>
        <CardBody>
          {error && (
            <Alert
              status='error'
              variant='left-accent'
              borderRadius={4}
              mb='10px'
            >
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <Form onSubmit={handleSumit}>
            <FormControl mb='20px'>
              <FormLabel>Name</FormLabel>
              <Input type='text' name='name' ref={nameRef} required />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Email</FormLabel>
              <Input type='email' name='email' ref={emailRef} required />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Password</FormLabel>
              <Input
                type='password'
                name='password'
                ref={passwordRef}
                isRequired
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type='password'
                name='confirm-password'
                ref={confirmPasswordRef}
                isRequired
              />
            </FormControl>
            <Button disabled={loading} type='submit' w='100%' colorScheme='red'>
              Sign Up
            </Button>
          </Form>
        </CardBody>
      </Card>
      <Text>
        Already have an account?{' '}
        <Link to='/login' color='blue.400' as={NavLink}>
          Login
        </Link>
      </Text>
    </Box>
  );
};

export default Signup;
