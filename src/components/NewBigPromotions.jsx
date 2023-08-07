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
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { Form } from "react-router-dom";
import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";

const NewBigPromotions = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();
  const storeRef = useRef();
  const titleRef = useRef();
  const aboutBusinessRef = useRef();
  const businessWebsiteRef = useRef();
  const businessSocialRef = useRef();
  const descriptionRef = useRef();
  const termsAndConditionsRef = useRef();
  const promocodeRef = useRef();
  const initTimeRef = useRef();
  const releaseTimeRef = useRef();
  const endTimeRef = useRef();
  const logoRef = useRef();
  const posterRef = useRef();
  const numCouponsRef = useRef();
  const claimMethodRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Create Big Promotion";
  }, []);

  async function handleSumit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      // save logo and poster to storage first
      const logoPath =
        "images/bigPromotions/logo/" +
        storeRef.current.value +
        releaseTimeRef.current.value +
        String(new Date().getTime());
      const posterPath =
        "images/bigPromotions/poster/" +
        storeRef.current.value +
        releaseTimeRef.current.value +
        String(new Date().getTime());
      const logoStorageRef = ref(storage, logoPath);
      const posterStorageRef = ref(storage, posterPath);

      if (logoRef.current.files[0] && posterRef.current.files[0]) {
        uploadBytes(logoStorageRef, logoRef.current.files[0]);
        uploadBytes(posterStorageRef, posterRef.current.files[0]);
      } else {
        setError("Logo and poster image cannot be empty");
      }

      const docId =
        storeRef.current.value +
        "-" +
        releaseTimeRef.current.value +
        "-" +
        String(new Date().getTime());

      // Adding using store name as document id
      await setDoc(doc(db, "bigPromotions", docId), {
        store: storeRef.current.value,
        title: titleRef.current.value,
        aboutBusiness: aboutBusinessRef.current.value,
        businessWebsite: businessWebsiteRef.current.value,
        businessSocial: businessSocialRef.current.value,
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
        claimMethod: claimMethodRef.current.value,
      });

      // add promotion to belong to business user's promotion
      await updateDoc(doc(db, "users", currentUser.uid), {
        promotions: arrayUnion(docId),
      });

      setSuccess("Successfully added big promotion.");
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
      display="flex"
      w="90%"
      mx="auto"
      maxW="800px"
      flexDir="column"
      alignItems="center"
    >
      <Card w="100%" mb="20px">
        <CardHeader
          fontFamily="Arial Rounded MT Bold"
          textAlign="center"
          fontSize="30px"
        >
          Make Big Promo
        </CardHeader>
        <CardBody>
          {error && (
            <Alert
              status="error"
              variant="left-accent"
              borderRadius={4}
              mb="10px"
            >
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          {success && (
            <Alert
              status="success"
              variant="left-accent"
              borderRadius={4}
              mb="10px"
            >
              <AlertIcon />
              <AlertTitle>{success}</AlertTitle>
            </Alert>
          )}

          <Form onSubmit={handleSumit}>
            <FormControl mb="20px" isRequired>
              <FormLabel>Store Name</FormLabel>
              <Text fontSize="xs" color="gray.600">
                be as descriptive as possible (must be unique)
              </Text>
              <Input id = 'bigPromoStoreNameInput' type="text" name="store" ref={storeRef} />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>Promotion Title</FormLabel>
              <Input id = 'bigPromoPromoTitleInput'type="text" name="title" ref={titleRef} />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>About business</FormLabel>
              <Textarea
                id = 'bigPromoAboutBusinessInput'
                type="text"
                name="aboutBusiness"
                ref={aboutBusinessRef}
              />
            </FormControl>

            <FormControl mb="20px">
              <FormLabel>Website link</FormLabel>
              <Input
                id = 'bigPromoAboutWebsiteLinkInput'
                type="text"
                name="businessWebsite"
                ref={businessWebsiteRef}
              />
            </FormControl>

            <FormControl mb="20px">
              <FormLabel>Social link</FormLabel>
              <Input
                id = 'bigPromoSocialLinkInput'
                type="text"
                name="businessSocial"
                ref={businessSocialRef}
              />
            </FormControl>

            <FormControl mb="20px">
              <FormLabel>Description (how to use promo)</FormLabel>
              <Textarea id = 'bigPromoDescriptionInput' type="text" name="description" ref={descriptionRef} />
            </FormControl>

            <FormControl mb="20px">
              <FormLabel>Terms And Conditions</FormLabel>
              <Textarea
                id = 'bigPromoTermsAndConditionsInput'
                type="text"
                name="termsAndConditions"
                ref={termsAndConditionsRef}
              />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>Promocode</FormLabel>
              <Input
               id = 'bigPromoCodeInput'
               type="text" name="promocode" ref={promocodeRef} />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>Init Time</FormLabel>
              <Input id = 'bigPromoInitTimeInput'
              type="datetime-local" name="initTime" ref={initTimeRef} />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>Release Time</FormLabel>
              <Input
                id = 'bigPromoReleaseTimeInput'
                type="datetime-local"
                name="releaseTime"
                ref={releaseTimeRef}
              />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>End Time</FormLabel>
              <Input 
                id = 'bigPromoEndTimeInput'
                type="datetime-local" name="endTime" ref={endTimeRef} />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>Logo Image</FormLabel>
              <Input id = 'bigLogoImageInput'
               type="file" name="logo" ref={logoRef} />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>Poster Image</FormLabel>
              <Input 
              id = 'bigPromoPosterimageInput'
              type="file" name="poster" ref={posterRef} />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>Number Of Coupons</FormLabel>
              <Input id = 'bigPromoNumCouponsInput' type="number" name="numberOfCoupons" ref={numCouponsRef} />
            </FormControl>

            <FormControl mb="20px" isRequired>
              <FormLabel>Promo Claim Method</FormLabel>
              <Select id = 'bigPromoSelectClaim' placeholder="Select" mb="20px" ref={claimMethodRef}>
                <option value="receiptupload">Receipt Upload</option>
                <option value="website">Website</option>
                <option value="instore">In Store</option>
              </Select>
            </FormControl>

            <Button id = 'bigPromoAddPromoButton' disabled={loading} type="submit" mb="15px" w="100%">
              Add Promo
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Box>
  );
};

export default NewBigPromotions;
