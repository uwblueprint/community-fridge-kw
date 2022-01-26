const ErrorMessages = {
  requiredField: "This is a required field.",
  recurringDonationEndDateWithinSixMonths:
    "End date must be within 6 months of start date.",
  recurringEndDateAfterStartDate:
    "The recurring donation end date must be after the selected start date.",
  invalidRecurringDonationEndDateFormat: "Required format: MM/DD/YYYY",
  invalidStartTime: "Scheduled donation time should be after the current time",
};

export default ErrorMessages;
