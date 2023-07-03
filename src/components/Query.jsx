import { Button, Container, Flex } from '@chakra-ui/react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Query = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // only allow access if user is admin
    const adminId = [
      'UHFdQbxBJ9hHrnoCppzABULrOAh2',
      'esQ0VPngPXhhTyXURe8tgNkiGHs1',
      'MMyr0QlXvYet4xvWHzWkriWGm7j2',
      'Yd2oFY3KnZXmnZHwjM645qvuZVC2',
    ];
    if (adminId.includes(currentUser.uid)) {
      setIsAdmin(true);
    }
  }, []);

  async function getUserClaimCount() {
    const userClaimCount = {};

    const usersRef = collection(db, 'users');

    // const q = query(usersRef);

    const querySnapshot = await getDocs(usersRef);

    querySnapshot.forEach((doc) => {
      const numOfClaims =
        doc.data().promotions.length + doc.data().usedPromotions.length;

      if (numOfClaims in userClaimCount) {
        userClaimCount[numOfClaims] += 1;
      } else {
        userClaimCount[numOfClaims] = 1;
      }
    });

    console.dir(userClaimCount);
  }

  return (
    <Container>
      <Flex justify='center'>
        {isAdmin && (
          <Button
            colorScheme='red'
            variant='solid'
            onClick={() => getUserClaimCount()}
          >
            Get user claim count
          </Button>
        )}
      </Flex>
    </Container>
  );
};

export default Query;
