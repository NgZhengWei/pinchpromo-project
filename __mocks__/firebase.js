export const db = {
  getDoc: jest.fn(() =>
    Promise.resolve({ data: () => ({ isBusinessAccount: false }) })
  ),
};
