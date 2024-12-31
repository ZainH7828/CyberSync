const calculateLicenseEndDate = (licensePeriod: string) => {
  const currentDate = new Date();
  let endDate;

  switch (licensePeriod) {
    case "1 week":
      endDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
      break;
    case "1 month":
      endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      break;
    case "2 month":
      endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 2));
      break;
    case "1 year":
      endDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      );
      break;
    case "custom":
      // Custom handling, ignoring for now
      endDate = null;
      break;
    default:
      endDate = null;
      break;
  }

  return endDate ? endDate.toISOString() : null; // Format the date as ISO string for the API
};

export default calculateLicenseEndDate;
