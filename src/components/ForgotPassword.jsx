import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { Form } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSumit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions.');
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        setError('No registered user');
      } else if (e.code === 'auth/invalid-email') {
        setError('Email formatting error');
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
          Password Reset
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
          {message && (
            <Alert
              status='success'
              variant='left-accent'
              borderRadius={4}
              mb='10px'
            >
              <AlertIcon />
              <AlertTitle>{message}</AlertTitle>
            </Alert>
          )}

          <Form onSubmit={handleSumit}>
            <FormControl mb='20px'>
              <FormLabel>Email</FormLabel>
              <Input type='email' name='email' ref={emailRef} required />
            </FormControl>

            <Button disabled={loading} type='submit' mb='15px' w='100%'>
              Reset Password
            </Button>
            <Text>
              <Link href='/login' color='blue.400'>
                Login?
              </Link>
            </Text>
          </Form>
        </CardBody>
      </Card>
      <Text>
        Don't have an account?{' '}
        <Link href='/signup' color='blue.400'>
          Sign up
        </Link>
      </Text>
    </Box>
  );
};

export default ForgotPassword;
