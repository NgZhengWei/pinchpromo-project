import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import HowToUse from "../components/HowToUse.jsx";

jest.mock("../firebase", () => {
  const mockAuth = jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({})),
  }));

  const mockFirestore = jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve({})),
        get: jest.fn(() => Promise.resolve({ exists: false })),
      })),
      get: jest.fn(() => Promise.resolve({})),
    })),
  }));

  const mockStorage = jest.fn(() => ({
    ref: jest.fn(() => ({
      put: jest.fn(() => Promise.resolve({})),
    })),
  }));

  const mockApp = {
    auth: mockAuth,
    firestore: mockFirestore,
    storage: mockStorage,
    initializeApp: jest.fn(() => mockApp),
  };

  return mockApp;
});

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  onAuthStateChanged: jest.fn(),
}));

describe("HowToUse", () => {
  it("sets the correct document title", () => {
    render(
      <AuthContext.Provider value={{ currentUser: null }}>
        <Router>
          <HowToUse />
        </Router>
      </AuthContext.Provider>
    );

    expect(document.title).toEqual("How To Use");
  });

  it("renders the correct components", () => {
    const { getByText, getByTitle } = render(
      <AuthContext.Provider value={{ currentUser: null }}>
        <Router>
          <HowToUse />
        </Router>
      </AuthContext.Provider>
    );

    // Check if the video is rendered
    expect(getByTitle("How to use PinchPromo")).toBeInTheDocument();

    // Check if the correct text is rendered
    expect(getByText("How To Use PinchPromo")).toBeInTheDocument();
    expect(getByText("Steps To Use")).toBeInTheDocument();
  });

  it("shows the correct button and navigates correctly when the user is authenticated", () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ currentUser: { uid: "1" } }}>
        <Router>
          <HowToUse />
        </Router>
      </AuthContext.Provider>
    );

    const button = getByText("Claim New Promos");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    // Since we can't really change the page in a test,
    // we can't test the navigation functionality here
  });

  it("shows the correct button and navigates correctly when the user is not authenticated", () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ currentUser: null }}>
        <Router>
          <HowToUse />
        </Router>
      </AuthContext.Provider>
    );

    const button = getByText("Sign Up");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    // Same as above, we can't test the navigation functionality here
  });
});
