// input: date object as input
// return: day difference rounded up to nearest int (date1 - date2)
// if return is -ve means day has passed
function getDayDifference(date1, date2) {
  const diffTime = date1 - date2;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default getDayDifference;
