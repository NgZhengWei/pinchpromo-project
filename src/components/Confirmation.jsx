import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const { currentUser } = useAuth();
  const [showSkipButton, setShowSkipButton] = useState(false);
  const navigate = useNavigate();

  async function sendEmailVerification() {
    await currentUser
      .sendEmailVerification({ url: 'https://pinchpromo.com/' })
      .then(() => {
        console.log('Verification email sent.');
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function resendEmailClickHandler(e) {
    sendEmailVerification();
  }

  function verifyLaterClickHandler(e) {
    navigate('/');
  }

  useEffect(() => {
    document.title = 'Email Confirmation';

    window.setTimeout(() => {
      setShowSkipButton(true);
    }, 4000);

    sendEmailVerification();
  }, []);

  return (
    <Container>
      <Card w='90%' mx='auto' py='5px'>
        <CardHeader>
          <Heading textAlign='center' mb='15px'>
            Confirm Your Email
          </Heading>
          <Text textAlign='center'>
            Please click on the link in your email address to confirm your
            email. Check your spam if you don't see it!
          </Text>
        </CardHeader>
        <CardBody
          py='0px'
          display='flex'
          flexDirection='column'
          justifyContent='center'
        ></CardBody>
        {/* <Button w='50%' mx='auto' mb='20px' backgroundColor='brandYellow.100'>
          Email verified
        </Button> */}
        {showSkipButton && (
          <Button w='50%' mx='auto' mb='20px' onClick={verifyLaterClickHandler}>
            Verify email later
          </Button>
        )}
      </Card>
      <Text w='90%' mx='auto' mt='10px' textAlign='center'>
        Did not get the email? Click{' '}
        <Link color='blue.400' onClick={resendEmailClickHandler}>
          here
        </Link>{' '}
        to resend.
      </Text>
    </Container>
  );
};

export default Confirmation;
