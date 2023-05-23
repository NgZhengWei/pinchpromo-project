import {
  Flex,
  Heading,
  Image,
  Link,
  List,
  ListItem,
  Spacer,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../img/logo.png';

const Nav = () => {
  const { currentUser } = useAuth();

  const loggedInNav = (
    <Flex mr='10px' alignItems='center' justifyContent='space-between' w='100%'>
      <Heading as='h3' fontSize={{ base: '18px', sm: '25px', md: '32px' }}>
        <Link
          to='/'
          as={NavLink}
          _activeLink={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Promos
        </Link>
      </Heading>

      <Spacer />

      <List display='flex' gap='15px'>
        <ListItem>
          <Heading as='h3' fontSize={{ base: '13px', sm: '15px', md: '24px' }}>
            <Link
              to='/mypromotions'
              as={NavLink}
              _activeLink={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Inventory
            </Link>
          </Heading>
        </ListItem>
        <ListItem>
          <Heading as='h3' fontSize={{ base: '13px', sm: '15px', md: '24px' }}>
            <Link
              to='/profile'
              as={NavLink}
              _activeLink={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Profile
            </Link>
          </Heading>
        </ListItem>
      </List>
    </Flex>
  );

  return (
    <Flex
      as='nav'
      alignItems='center'
      bg='brandYellow.100'
      py='20px'
      px={{ base: '10px', sm: '15px', md: '40px' }}
    >
      <Image src={Logo} boxSize={{ base: '40px', sm: '60px', md: '80px' }} />

      {currentUser ? (
        loggedInNav
      ) : (
        <Flex justifyContent='space-between' w='100%' pr='10px'>
          <Heading fontSize={{ base: '24px', sm: '30px', md: '42px' }}>
            <Link
              to='/'
              as={NavLink}
              _activeLink={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              PinchPromo
            </Link>
          </Heading>
          <Heading fontSize={{ base: '24px', sm: '30px', md: '42px' }} as='h3'>
            <Link
              to='/signup'
              as={NavLink}
              _activeLink={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Sign Up
            </Link>
          </Heading>
        </Flex>
      )}
    </Flex>
  );
};

export default Nav;
