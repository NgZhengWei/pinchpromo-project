import { Box } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const RootLayout = () => {
  return (
    <Box>
      <Nav />
      <Box minH="82vh" bg="gray.100" pt="15px">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default RootLayout;
