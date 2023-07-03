import { QuestionIcon } from '@chakra-ui/icons';
import {
  Heading,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  useDisclosure,
  Box,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';

const InfoModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box position='absolute' top='-2px' left='-15px'>
      <Button onClick={onOpen} variant='unstyled'>
        <QuestionIcon boxSize={5} _hover={{ color: 'white' }} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mt='20px'>
            <Heading textAlign='center'> How does PinchPromo works?</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb='15px'>
              These are your claimed promos! They will be{' '}
              <b>useable once the details are released.</b>
            </Text>

            <Text mb='15px'>
              Promos which are useable or closest to usable are placed nearer
              the top for your convenience.
            </Text>

            <Text mb='0px'>Promos are used in one of 3 ways:</Text>

            <OrderedList mb='15px'>
              <ListItem>
                <b>In Store:</b> press use and show the countdown timer to
                cashier
              </ListItem>
              <ListItem>
                <b>Website:</b> press use to obtain the promocode to key into
                their designated site
              </ListItem>
              <ListItem>
                <b>Receipt upload:</b> do not show promotion to staff. Pay as
                per normal and upload receipt to "Receipt Upload" tab. Press use
                button to indicate you have used it
              </ListItem>
            </OrderedList>

            <Text>Happy Pinching Promos 😊</Text>
          </ModalBody>

          <ModalFooter>
            <Button
              backgroundColor='brandYellow.100'
              mr={3}
              onClick={onClose}
              _focus={{ backgroundColor: 'brandYellow.200' }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InfoModal;
