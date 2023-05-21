import {
  Flex,
  Heading,
  Image,
  Link,
  List,
  ListItem,
  Spacer,
  useToast,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../img/logo.png';
import { UnlockIcon } from '@chakra-ui/icons';

const Nav = () => {
  const { currentUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const loggedInNav = (
    <>
      <Heading as='h3' fontSize={{ base: '18px', sm: '25px', md: '32px' }}>
        <NavLink to='/'>Promos</NavLink>
      </Heading>

      <Spacer />

      <List display='flex' gap='15px'>
        <ListItem>
          <Heading as='h3' fontSize={{ base: '13px', sm: '15px', md: '24px' }}>
            <NavLink to='/mypromotions'>MyPromos</NavLink>
          </Heading>
        </ListItem>
        <ListItem>
          <Heading as='h3' fontSize={{ base: '13px', sm: '15px', md: '24px' }}>
            <NavLink to='/profile'>Profile</NavLink>
          </Heading>
        </ListItem>
      </List>
    </>
  );

  return (
    <Flex
      as='nav'
      alignItems='center'
      bg='brandYellow.100'
      py='20px'
      px={{ base: '10px', sm: '15px', md: '40px' }}
      gap='15px'
    >
      <Image src={Logo} boxSize={{ base: '40px', sm: '60px', md: '80px' }} />

      {currentUser ? (
        loggedInNav
      ) : (
        <Heading fontSize={{ base: '24px', sm: '30px', md: '42px' }}>
          <Link href='/signup'>PinchPromo</Link>
        </Heading>
      )}
    </Flex>
  );
};

export default Nav;
