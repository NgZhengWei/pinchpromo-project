import getDayDifference from "../util/getDayDifference";

describe("getDayDifference", () => {
  test("should return 0 when both dates are the same", () => {
    const date1 = new Date("2023-08-01");
    const date2 = new Date("2023-08-01");
    expect(getDayDifference(date1, date2)).toBe(0);
  });

  test("should return a positive number when date1 is later than date2", () => {
    const date1 = new Date("2023-08-10");
    const date2 = new Date("2023-08-01");
    expect(getDayDifference(date1, date2)).toBe(9);
  });

  test("should return a negative number when date1 is earlier than date2", () => {
    const date1 = new Date("2023-08-01");
    const date2 = new Date("2023-08-10");
    expect(getDayDifference(date1, date2)).toBe(-9);
  });

  test("should handle fractional day differences", () => {
    const date1 = new Date("2023-08-10 12:00:00");
    const date2 = new Date("2023-08-01 06:00:00");
    // 9 days and 6 hours difference, should round up to 10 days
    expect(getDayDifference(date1, date2)).toBe(10);
  });

  test("should handle daylight saving time changes", () => {
    // DST starts on March 12, 2023
    const date1 = new Date("2023-03-12 02:00:00"); // DST time (1 hour ahead of standard time)
    const date2 = new Date("2023-03-11 23:00:00"); // Standard time
    // 3 hours difference, but should be considered as 1 day due to DST change
    expect(getDayDifference(date1, date2)).toBe(1);
  });

  test("should handle leap years", () => {
    // Leap year: 2024 (Feb 29 exists)
    const date1 = new Date("2024-03-01");
    const date2 = new Date("2024-02-28");
    // 2 days difference (Feb 29 exists), should return 2 days
    expect(getDayDifference(date1, date2)).toBe(2);
  });

  test("should return NaN when invalid dates are provided", () => {
    const date1 = new Date("InvalidDate");
    const date2 = new Date("2023-08-01");
    expect(getDayDifference(date1, date2)).toBe(NaN);
  });
});
