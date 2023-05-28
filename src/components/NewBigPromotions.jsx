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
  Text,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { Form } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

const NewBigPromotions = () => {
  const storeRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const termsAndConditionsRef = useRef();
  const promocodeRef = useRef();
  const initTimeRef = useRef();
  const releaseTimeRef = useRef();
  const endTimeRef = useRef();
  const logoRef = useRef();
  const posterRef = useRef();
  const numCouponsRef = useRef();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSumit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      // save logo and poster to storage first
      const logoPath =
        'images/bigPromotions/logo/' +
        storeRef.current.value +
        releaseTimeRef.current.value +
        v4();
      const posterPath =
        'images/bigPromotions/poster/' +
        storeRef.current.value +
        releaseTimeRef.current.value +
        v4();
      const logoStorageRef = ref(storage, logoPath);
      const posterStorageRef = ref(storage, posterPath);

      if (logoRef.current.files[0] && posterRef.current.files[0]) {
        uploadBytes(logoStorageRef, logoRef.current.files[0]);
        uploadBytes(posterStorageRef, posterRef.current.files[0]);
      } else {
        setError('Logo and poster image cannot be empty');
      }
      // Adding using store name as document id
      await setDoc(
        doc(
          db,
          'bigPromotions',
          storeRef.current.value +
            '-' +
            releaseTimeRef.current.value +
            '-' +
            v4()
        ),
        {
          store: storeRef.current.value,
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          termsAndCondition: termsAndConditionsRef.current.value,
          pathToLogo: logoPath,
          pathToPoster: posterPath,
          promocode: promocodeRef.current.value,
          initTime: initTimeRef.current.value,
          releaseTime: releaseTimeRef.current.value,
          endTime: endTimeRef.current.value,
          numberOfCoupons: parseInt(numCouponsRef.current.value),
          numberOfCouponsClaimed: 0,
          timestampClaim: [],
        }
      );
      setSuccess('Successfully added big promotion.');
      window.scrollTo(0, 0);
      // Adding without document id
      // await addDoc(bigPromotionsCollectionRef, {
      //   store: storeRef.current.value,
      //   title: titleRef.current.value,
      //   description: descriptionRef.current.value,
      //   termsAndCondition: termsAndConditionsRef.current.value,
      //   pathToLogo: pathToLogoRef.current.value,
      //   pathToPoster: pathToPosterRef.current.value,
      //   promocode: promocodeRef.current.value,
      //   releaseTime: releaseTimeRef.current.value,
      //   endTime: endTimeRef.current.value,
      // });
    } catch (e) {
      console.error(e);
      setError(e.message);
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
          Make Big Promo
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

          <Form onSubmit={handleSumit}>
            <FormControl mb='20px'>
              <FormLabel>Store Name</FormLabel>
              <Text fontSize='xs' color='gray.600'>
                be as descriptive as possible (must be unique)
              </Text>
              <Input type='text' name='store' ref={storeRef} required />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Promotion Title</FormLabel>
              <Input type='text' name='title' ref={titleRef} required />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Description</FormLabel>
              <Input
                type='text'
                name='description'
                ref={descriptionRef}
                isRequired
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Terms And Conditions</FormLabel>
              <Input
                type='text'
                name='termsAndConditions'
                ref={termsAndConditionsRef}
                isRequired
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Promocode</FormLabel>
              <Input
                type='text'
                name='promocode'
                ref={promocodeRef}
                isRequired
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Init Time</FormLabel>
              <Input
                type='datetime-local'
                name='initTime'
                ref={initTimeRef}
                isRequired
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Release Time</FormLabel>
              <Input
                type='datetime-local'
                name='releaseTime'
                ref={releaseTimeRef}
                isRequired
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>End Time</FormLabel>
              <Input
                type='datetime-local'
                name='endTime'
                ref={endTimeRef}
                isRequired
              />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Logo Image</FormLabel>
              <Input type='file' name='logo' ref={logoRef} isRequired />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Poster Image</FormLabel>
              <Input type='file' name='poster' ref={posterRef} isRequired />
            </FormControl>
            <FormControl mb='20px'>
              <FormLabel>Number Of Coupons</FormLabel>
              <Input
                type='number'
                name='numberOfCoupons'
                ref={numCouponsRef}
                isRequired
              />
            </FormControl>

            <Button disabled={loading} type='submit' mb='15px' w='100%'>
              Add Promo
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Box>
  );
};

export default NewBigPromotions;
