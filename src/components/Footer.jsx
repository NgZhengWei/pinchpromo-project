import { ChatIcon, EmailIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Heading, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex
      py='25px'
      px={{ base: '10px', sm: '15px', md: '40px' }}
      backgroundColor='brandYellow.100'
      justify='space-between'
      alignItems='center'
    >
      <Box>
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
              Email: hello@pinchpromo.com
            </Text>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default Footer;
