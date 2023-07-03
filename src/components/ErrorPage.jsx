import { Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  function returnToHomeClickHandler(e) {
    navigate('/');
  }

  return (
    <Flex direction='column' justify='center'>
      <Heading textAlign='center' mb='25px'>
        Oops something went wrong.
      </Heading>
      <Button onClick={returnToHomeClickHandler} colorScheme='red' m='auto'>
        Go back to home
      </Button>
    </Flex>
  );
};

export default ErrorPage;
