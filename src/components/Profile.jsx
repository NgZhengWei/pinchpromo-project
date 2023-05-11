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

const Profile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSumit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError('Passwords do not match');
    }

    const promises = [];
    setLoading(true);
    setError('');
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }
    Promise.all(promises)
      .then(() => {
        navigate('/');
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
          Update Profile
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
              <Input
                type='email'
                name='email'
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Password</FormLabel>
              <Input
                type='password'
                name='password'
                ref={passwordRef}
                placeholder='Leave blank to keep the same'
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type='password'
                name='confirm-password'
                ref={confirmPasswordRef}
                placeholder='Leave blank to keep the same'
              />
            </FormControl>
            <Button disabled={loading} type='submit' w='100%'>
              Update
            </Button>
          </Form>
        </CardBody>
      </Card>
      <Text>
        <Link href='/' color='blue.400'>
          Cancel
        </Link>
      </Text>
    </Box>
  );
};

export default Profile;
