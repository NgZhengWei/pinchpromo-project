import { ChatIcon, EmailIcon } from '@chakra-ui/icons';
import { Box, HStack, Heading, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';

const Footer = () => {
  return (
    <Box
      bg='brandYellow.100'
      py='25px'
      pl={{ base: '10px', sm: '15px', md: '40px' }}
    >
      <Heading
        as='h3'
        mb='10px'
        fontSize={{ base: '18px', sm: '25px', md: '32px' }}
      >
        Contact Us
      </Heading>
      <Box ml={2}>
        <HStack>
          <ChatIcon />
          <Text fontSize={{ base: '13px', sm: '15px', md: '16px' }}>
            Telegram: @alestierK
          </Text>
        </HStack>
        <HStack>
          <EmailIcon />
          <Text fontSize={{ base: '13px', sm: '15px', md: '16px' }}>
            alestier@pinchpromo.com
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default Footer;
