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
  Checkbox,
} from "@chakra-ui/react";
import React, { useRef, useState, useEffect } from "react";
import { Form, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { CheckIcon } from "@chakra-ui/icons";

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const receiveEmailRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    document.title = "Business Signup";
  }, []);

  async function makeNewUser(user) {
    // console.dir(user);
    // console.log(user.email);
    // console.log(user.uid);
    const currentTime = new Date().toJSON();

    await setDoc(doc(db, "users", user.uid), {
      name: nameRef.current.value,
      email: emailRef.current.value,
      promotions: [],
      usedPromotions: [],
      claimAvailable: 1,
      claimCapacity: 1,
      nextClaimTime: "",
      timeCreated: currentTime,
      receiveEmailMarketing: receiveEmailRef.current.checked,
      gender: null,
      isBusinessAccount: true,
    });
  }

  async function handleSumit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value)
        .then((userCredentials) => {
          // set user details in firebase user table
          makeNewUser(userCredentials.user);
          // add user's name to user credentials in auth
          return userCredentials.user.updateProfile({
            displayName: nameRef.current.value,
          });
        })
        .catch((e) => {
          console.error(e);
        });
      toast({
        title: "Welcome to PinchPromo",
        description:
          "Thanks for joining us. You may create promotions for our users and see their performance!",
        isClosable: true,
        duration: 10000,
        status: "success",
        position: "top",
        icon: <CheckIcon />,
      });
      navigate("/dashboard");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else if (e.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (e.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError(e.message);
      }
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
          Business Sign Up
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

          <Form onSubmit={handleSumit}>
            <FormControl mb="20px">
              <FormLabel>Business Name</FormLabel>
              <Input type="text" name="name" ref={nameRef} required />
            </FormControl>

            <FormControl mb="20px">
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" ref={emailRef} required />
            </FormControl>

            <FormControl mb="20px">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                ref={passwordRef}
                isRequired
              />
            </FormControl>

            <FormControl mb="20px">
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                name="confirm-password"
                ref={confirmPasswordRef}
                isRequired
              />
            </FormControl>

            <FormControl mb="20px">
              <Checkbox defaultChecked ref={receiveEmailRef}>
                <Text fontSize={{ base: "13px", sm: "16px" }}>
                  I agree to receive emails but not spam.
                </Text>
              </Checkbox>
            </FormControl>
            <Button disabled={loading} type="submit" w="100%" colorScheme="red">
              Sign Up
            </Button>
          </Form>
        </CardBody>
      </Card>
      <Text>
        Already have a business account?{" "}
        <Link to="/businesslogin" color="blue.400" as={NavLink}>
          Login
        </Link>
      </Text>
      <Text>
        Not a business?{" "}
        <Link to="/signup" color="blue.400" as={NavLink}>
          Sign up as user
        </Link>
      </Text>
    </Box>
  );
};

export default Signup;
