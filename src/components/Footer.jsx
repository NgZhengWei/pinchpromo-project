import { ChatIcon, EmailIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Heading, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex
      py="25px"
      px={{ base: "10px", sm: "15px", md: "40px" }}
      backgroundColor="brandYellow.100"
      justify="space-between"
      alignItems="center"
    >
      <Box>
        <Heading
          as="h3"
          mb="10px"
          fontSize={{ base: "18px", sm: "25px", md: "32px" }}
        >
          Contact Us
        </Heading>
        <Box ml={2}>
          <HStack>
            <ChatIcon />
            <Link href="https://t.me/alestierk">
              <Text fontSize={{ base: "13px", sm: "15px", md: "16px" }}>
                Telegram: @alestierK
              </Text>
            </Link>
          </HStack>
          <HStack>
            <EmailIcon />
            <Link href="mailto:hello@pinchpromo.com">
              <Text fontSize={{ base: "13px", sm: "15px", md: "16px" }}>
                Email: hello@pinchpromo.com
              </Text>
            </Link>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default Footer;
