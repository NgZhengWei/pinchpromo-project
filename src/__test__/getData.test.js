import { getOneUser } from "../util/getData";
import { doc, getDoc } from "firebase/firestore";

jest.mock("../firebase", () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
  },
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe("getOneUser", () => {
  const docData = {
    name: "PinchPromo",
    promotions: [
      "Eltelierworks-2023-06-26T14:55-687c9e10-aee2-44dd-9859-7c95810b478f",
      "Gomgom-2023-06-23T14:52-a61e667d-3404-4c52-a140-2e0b3b824770",
      "PinchPromo-2023-08-02T19:30-1690889459741",
    ],
    nextClaimTime: "",
    timeCreated: "2023-07-31T14:09:52.906Z",
    isBusinessAccount: true,
    usedPromotions: [],
    claimAvailable: 1,
    gender: null,
    email: "user@gmail.com",
    claimCapacity: 1,
    receiveEmailMarketing: true,
  };

  it("returns the user data when a valid uid is given", async () => {
    getDoc.mockResolvedValueOnce({ data: () => docData });
    const uid = "valid-uid";
    const userData = await getOneUser(uid);
    expect(userData.name).toEqual("PinchPromo");
    // Add more assertions as needed
  });

  it("throws an error when an invalid uid is given", async () => {
    const uid = "invalid-uid";
    const expectedError = `Error getting user with uid ${uid}`;
    getDoc.mockRejectedValueOnce(new Error(expectedError));
    await expect(getOneUser(uid)).rejects.toThrow(expectedError);
  });
});
