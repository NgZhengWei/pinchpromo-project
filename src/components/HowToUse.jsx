import {
  AspectRatio,
  Button,
  Container,
  Heading,
  ListItem,
  OrderedList,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HowToUse = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = 'How To Use';
  }, []);

  function onClickHandler(e) {
    navigate('/');
  }

  function onClickHandlerNewUser(e) {
    navigate('/signup');
  }

  const bodyFontSize = { base: '13px', sm: '16px' };
  const buttonFontSize = { base: '16px', sm: '20px' };
  const headingFontSize = { base: '24px', sm: '24px', md: '28px' };

  return (
    <Container display='flex' flexDir='column'>
      <Heading mt='5px' mb='20px' textAlign='center'>
        How To Use PinchPromo
      </Heading>
      <AspectRatio ratio={16 / 9} mb='15px'>
        <iframe
          title='How to use PinchPromo'
          src='https://www.youtube.com/embed/W3Q5h756igs'
          allowFullScreen
        />
      </AspectRatio>

      <Text fontSize={bodyFontSize} mb='15px'>
        Watch the above video for a short 30s intro on how you can claim and use
        the best promos available 🔥
      </Text>

      <Heading mb='5px' as='h3' fontSize={headingFontSize}>
        Steps To Use
      </Heading>

      <OrderedList fontSize={bodyFontSize} mb='40px'>
        <ListItem>
          <b>Claim</b> your favourite promo from "Claim Promos" tab
        </ListItem>
        <ListItem>
          <b>Wait for details</b> of promo to be released
        </ListItem>
        <ListItem>
          <b>Use promo</b> by going to "Claimed" tab and clicking on use
        </ListItem>
        <ListItem>
          Be sure to read "How To Use" dropdown before confirming usage of promo
          and <b>save $$!</b>
        </ListItem>
      </OrderedList>

      {currentUser && (
        <Button
          onClick={onClickHandler}
          colorScheme='red'
          alignSelf='center'
          fontSize={buttonFontSize}
          mb='40px'
        >
          Claim New Promos
        </Button>
      )}

      {!currentUser && (
        <Button
          onClick={onClickHandlerNewUser}
          colorScheme='red'
          alignSelf='center'
          fontSize={buttonFontSize}
          mb='40px'
        >
          Sign Up
        </Button>
      )}
    </Container>
  );
};

export default HowToUse;
