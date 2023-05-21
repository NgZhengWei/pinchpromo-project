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
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSumit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (e) {
      setError(e);
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
          Login
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
            <Button
              disabled={loading}
              type='submit'
              mb='15px'
              w='100%'
              colorScheme='red'
            >
              Login
            </Button>
            <Text>
              <Link href='/forgotpassword' color='blue.400'>
                Forgot password?
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

export default Login;
