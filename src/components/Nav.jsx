import {
  Flex,
  Heading,
  Image,
  Link,
  Spacer,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../img/logo.png";
import { useEffect, useRef, useState } from "react";
import {
  AddIcon,
  AttachmentIcon,
  HamburgerIcon,
  InfoOutlineIcon,
  PlusSquareIcon,
  SettingsIcon,
  StarIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { getOneUser } from "../util/getData";

const Nav = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [navbarType, setNavbarType] = useState("logged-out");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  useEffect(() => {
    async function getUserData() {
      const user = await getOneUser(currentUser.uid);

      setUserData(user);

      if (user.isBusinessAccount) {
        setNavbarType("business");
      } else {
        setNavbarType("user");
      }
    }

    if (currentUser) {
      getUserData();
    }
  }, [currentUser]);

  const loginAndSignupFontSize = { base: "14px", sm: "16px", md: "20px" };

  const loggedInNav = (
    <Flex mr="10px" alignItems="center" justifyContent="space-between" w="100%">
      <Heading as="h3" fontSize={{ base: "18px", sm: "25px", md: "32px" }}>
        <Link
          to="/"
          as={NavLink}
          _activeLink={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Claim Promos
        </Link>
      </Heading>

      <Spacer />

      <HamburgerIcon
        boxSize={{ base: 6, sm: 7, md: 8 }}
        ref={btnRef}
        onClick={onOpen}
        ml="10px"
        cursor="pointer"
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack>
              <Image src={Logo} boxSize={{ base: "40px" }} />
              <Text>PinchPromo</Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <Link
              onClick={onClose}
              fontFamily="Arial Rounded MT Bold"
              to="/"
              as={NavLink}
              _activeLink={{
                color: "brandYellow.100",
                textDecoration: "none",
              }}
              display="flex"
              alignItems="center"
              fontSize={{ base: "18px" }}
              mb="10px"
            >
              <AddIcon mr="5px" />
              <Text mt="2px">Claim Promos</Text>
            </Link>

            <Link
              onClick={onClose}
              fontFamily="Arial Rounded MT Bold"
              to="/mypromotions"
              as={NavLink}
              _activeLink={{
                color: "brandYellow.100",
                textDecoration: "none",
              }}
              display="flex"
              alignItems="center"
              fontSize={{ base: "18px" }}
              mb="10px"
            >
              <StarIcon mr="5px" />
              <Text mt="2px">Claimed</Text>
            </Link>

            <Link
              onClick={onClose}
              fontFamily="Arial Rounded MT Bold"
              to="/receiptclaim"
              as={NavLink}
              _activeLink={{
                color: "brandYellow.100",
                textDecoration: "none",
              }}
              display="flex"
              alignItems="center"
              fontSize={{ base: "18px" }}
              mb="10px"
            >
              <AttachmentIcon mr="5px" />
              <Text mt="2px">Receipt Upload</Text>
            </Link>

            <Link
              onClick={onClose}
              fontFamily="Arial Rounded MT Bold"
              to="/howtouse"
              as={NavLink}
              _activeLink={{
                color: "brandYellow.100",
                textDecoration: "none",
              }}
              display="flex"
              alignItems="center"
              fontSize={{ base: "18px" }}
              mb="10px"
            >
              <InfoOutlineIcon mr="5px" />
              <Text mt="2px">How to use</Text>
            </Link>

            <Link
              onClick={onClose}
              fontFamily="Arial Rounded MT Bold"
              to="/profile"
              as={NavLink}
              _activeLink={{
                color: "brandYellow.100",
                textDecoration: "none",
              }}
              display="flex"
              alignItems="center"
              fontSize={{ base: "18px" }}
              mb="10px"
            >
              <SettingsIcon mr="5px" />
              <Text mt="2px">Profile</Text>
            </Link>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );

  const businessNav = (
    <Flex mr="10px" alignItems="center" justifyContent="space-between" w="100%">
      <Heading as="h3" fontSize={{ base: "18px", sm: "25px", md: "32px" }}>
        <Link
          to="/dashboard"
          as={NavLink}
          _activeLink={{
            color: "white",
            textDecoration: "none",
          }}
        >
          PinchPromo Business
        </Link>
      </Heading>

      <Spacer />

      <HamburgerIcon
        boxSize={{ base: 6, sm: 7, md: 8 }}
        ref={btnRef}
        onClick={onOpen}
        ml="10px"
        cursor="pointer"
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack>
              <Image src={Logo} boxSize={{ base: "40px" }} />
              <Text>PinchPromo</Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <Link
              onClick={onClose}
              fontFamily="Arial Rounded MT Bold"
              to="/dashboard"
              as={NavLink}
              _activeLink={{
                color: "brandYellow.100",
                textDecoration: "none",
              }}
              display="flex"
              alignItems="center"
              fontSize={{ base: "18px" }}
              mb="10px"
            >
              <ViewIcon mr="5px" />
              <Text mt="2px">Dashboard</Text>
            </Link>

            <Link
              onClick={onClose}
              fontFamily="Arial Rounded MT Bold"
              to="/newbigpromotions"
              as={NavLink}
              _activeLink={{
                color: "brandYellow.100",
                textDecoration: "none",
              }}
              display="flex"
              alignItems="center"
              fontSize={{ base: "18px" }}
              mb="10px"
            >
              <PlusSquareIcon mr="5px" />
              <Text mt="2px">Create New Promotion</Text>
            </Link>

            <Link
              onClick={onClose}
              fontFamily="Arial Rounded MT Bold"
              to="/profile"
              as={NavLink}
              _activeLink={{
                color: "brandYellow.100",
                textDecoration: "none",
              }}
              display="flex"
              alignItems="center"
              fontSize={{ base: "18px" }}
              mb="10px"
            >
              <SettingsIcon mr="5px" />
              <Text mt="2px">Profile</Text>
            </Link>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );

  const loggedOutNav = (
    <Flex justifyContent="space-between" w="100%" pr="10px" alignItems="center">
      <Heading fontSize={{ base: "20px", sm: "30px", md: "42px" }}>
        <Link
          to="/"
          as={NavLink}
          _activeLink={{
            color: "white",
            textDecoration: "none",
          }}
        >
          PinchPromo
        </Link>
      </Heading>
      <Flex>
        <Text fontSize={loginAndSignupFontSize} as="h3">
          <Link
            to="/login"
            as={NavLink}
            py="6px"
            px="15px"
            fontWeight="bold"
            _activeLink={{
              color: "white",
              textDecoration: "none",
              backgroundColor: "brandYellow.100",
            }}
          >
            Login
          </Link>
        </Text>

        <Text fontSize={loginAndSignupFontSize} as="h3">
          <Link
            to="/signup"
            as={NavLink}
            backgroundColor="white"
            borderRadius="8px"
            py="6px"
            px="15px"
            fontWeight="extrabold"
            _activeLink={{
              color: "white",
              textDecoration: "none",
              backgroundColor: "brandYellow.100",
            }}
          >
            Sign Up
          </Link>
        </Text>
      </Flex>
    </Flex>
  );

  return (
    <Flex
      as="nav"
      alignItems="center"
      bg="brandYellow.100"
      py="20px"
      px={{ base: "10px", sm: "15px", md: "40px" }}
    >
      <Image src={Logo} boxSize={{ base: "40px", sm: "60px", md: "80px" }} />

      {navbarType === "logged-out" && loggedOutNav}
      {navbarType === "user" && loggedInNav}
      {navbarType === "business" && businessNav}

      {/* {currentUser
        ? userData.isBusinessAccount
          ? businessNav
          : loggedInNav
        : loggedOutNav} */}
    </Flex>
  );
};

export default Nav;
