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
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { Form } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function makeNewUser(user) {
    // console.dir(user);
    // console.log(user.email);
    // console.log(user.uid);

    await setDoc(doc(db, 'users', user.uid), {
      name: nameRef.current.value,
      email: emailRef.current.value,
      promotions: [],
      usedPromotions: [],
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
      navigate('/');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else {
        setError(e.message);
      }
    }

    setLoading(false);
  }

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
        <Link href='/login' color='blue.400'>
          Login
        </Link>
      </Text>
    </Box>
  );
};

export default Signup;
