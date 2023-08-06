import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Profile from "../components/Profile";

// Mock the AuthContext module
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    currentUser: {
      email: "test@example.com",
    },
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock the react-router-dom modules
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Form: "form", // Mock the Form component
  useNavigate: jest.fn(),
}));

// Mock the useToast hook
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Test 1: Renders the Profile component
test("renders the Profile component", () => {
  render(<Profile />);

  // Check if the component renders without errors
  const header = screen.getByText("Update Profile");
  expect(header).toBeInTheDocument();

  const emailInput = screen.getByLabelText("Email");
  expect(emailInput).toBeInTheDocument();

  const passwordInput = screen.getByLabelText("New Password");
  expect(passwordInput).toBeInTheDocument();

  const confirmPasswordInput = screen.getByLabelText("New Confirmed Password");
  expect(confirmPasswordInput).toBeInTheDocument();

  const updateButton = screen.getByText("Update");
  expect(updateButton).toBeInTheDocument();
});

// Test 2: Displays error for non-matching passwords
test("displays error for non-matching passwords", async () => {
  render(<Profile />);

  const passwordInput = screen.getByLabelText("New Password");
  const confirmPasswordInput = screen.getByLabelText("New Confirmed Password");
  const updateButton = screen.getByText("Update");

  // Simulate user input with non-matching passwords
  fireEvent.change(passwordInput, { target: { value: "password1" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "password2" } });

  // Submit the form
  fireEvent.click(updateButton);

  // Wait for the async actions to complete
  await waitFor(() => {
    // Check if the error message is displayed
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });
});
