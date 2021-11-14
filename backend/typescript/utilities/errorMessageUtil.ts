const getErrorMessage = (error: unknown): string => {
  return error instanceof Error
    ? getErrorMessage(error)
    : "Error: Caught error of invalid type ";
};

export default getErrorMessage;
