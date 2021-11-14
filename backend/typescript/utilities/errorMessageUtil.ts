const getErrorMessage = (error: unknown): string => {
  return error instanceof Error
    ? error.message
    : "Error: Caught error of invalid type ";
};

export default getErrorMessage;
