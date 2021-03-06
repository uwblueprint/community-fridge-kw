import { Categories } from "../../types";

type Type =
  | "string"
  | "integer"
  | "boolean"
  | "Status"
  | "Date string"
  | "24 Hour Time String";

const allowableContentTypes = new Set([
  "text/plain",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
]);

export const validateDate = (value: string): boolean => {
  return !!Date.parse(value);
};

export const validate24HourTime = (value: string): boolean => {
  const regEx = new RegExp(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
  return regEx.test(value);
};

export const validateRecurringDonationEndDate = (
  startDateString: string,
  recurringEndDateString: string,
): boolean => {
  const startDate = new Date(startDateString);
  const maxEndDate = new Date(startDateString);
  maxEndDate.setMonth(startDate.getMonth() + 6);
  const endDate = new Date(recurringEndDateString);
  return startDate <= endDate && endDate <= maxEndDate;
};

export const validatePrimitive = (value: any, type: Type): boolean => {
  if (value === undefined || value === null) return false;

  switch (type) {
    case "string": {
      return typeof value === "string";
    }
    case "boolean": {
      return typeof value === "boolean";
    }
    case "integer": {
      return typeof value === "number" && Number.isInteger(value);
    }
    default: {
      return false;
    }
  }
};

export const validateArray = (value: any, type: Type): boolean => {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    Array.isArray(value) &&
    value.every((item) => validatePrimitive(item, type))
  );
};

export const validateCategories = (value: string[]): boolean => {
  return (
    validateArray(value, "string") &&
    value.every((item) => Categories.has(item))
  );
};

export const validateFileType = (mimetype: string): boolean => {
  return allowableContentTypes.has(mimetype);
};

export const getApiValidationError = (
  fieldName: string,
  type: Type,
  isArray = false,
  isDateError = false,
): string => {
  if (isDateError) {
    return "startTime must be before endTime";
  }
  return `The ${fieldName} is not a ${type}${isArray ? " Array" : ""}`;
};

export const getFileTypeValidationError = (mimetype: string): string => {
  const allowableContentTypesString = [...allowableContentTypes].join(", ");
  return `The file type ${mimetype} is not one of ${allowableContentTypesString}`;
};
