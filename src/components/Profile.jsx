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
  useToast,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { Form } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, UnlockIcon } from '@chakra-ui/icons';

const Profile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { currentUser, updateEmail, updatePassword, logout } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  async function handleLogout(e) {
    try {
      await logout();
      toast({
        title: 'Logged Out',
        description: 'Successfully logged out',
        isClosable: true,
        duration: 3000,
        status: 'success',
        position: 'top',
        icon: <UnlockIcon />,
      });
      navigate('/login');
    } catch {
      toast({
        title: 'Logged Out',
        description: 'Failed to logged out',
        isClosable: true,
        duration: 3000,
        status: 'error',
        position: 'bottom',
        icon: <UnlockIcon />,
      });
    }
  }

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
        toast({
          title: 'Profile successfully updated.',
          isClosable: true,
          duration: 3000,
          status: 'success',
          position: 'top',
          icon: <CheckIcon />,
        });
      })
      .catch((e) => {
        if (e.code === 'auth/requires-recent-login') {
          setError('Please logout and login again to reset your password.');
        }
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
              <FormLabel>New Password</FormLabel>
              <Input
                type='password'
                name='password'
                ref={passwordRef}
                placeholder='Leave blank to keep the same'
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>New Confirmed Password</FormLabel>
              <Input
                type='password'
                name='confirm-password'
                ref={confirmPasswordRef}
                placeholder='Leave blank to keep the same'
              />
            </FormControl>
            <Button disabled={loading} type='submit' w='100%' colorScheme='red'>
              Update
            </Button>
          </Form>
        </CardBody>
      </Card>
      <Button onClick={handleLogout} variant='ghost' colorScheme='gray'>
        Logout
      </Button>
      {/* <Text>
        <Link href='/' color='blue.400'>
          Cancel
        </Link>
      </Text> */}
    </Box>
  );
};

export default Profile;
