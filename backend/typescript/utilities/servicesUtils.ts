import { snakeCase } from "lodash";
import dayjs from "dayjs";
import { DTOTypes } from "../types";
import logger from "./logger";

const Logger = logger(__filename);

// eslint-disable-next-line import/prefer-default-export
export const toSnakeCase = (dto: DTOTypes): DTOTypes => {
  const dtoSnakeCase: DTOTypes = {};
  Object.entries(dto).forEach(([key, value]) => {
    dtoSnakeCase[snakeCase(key)] = value;
  });
  return dtoSnakeCase;
};

export const getDateWithVolunteerTime = (
  date: Date,
  volunteerTime: string | null | undefined,
): dayjs.Dayjs => {
  if (volunteerTime) {
    try {
      const [hours, minutes] = volunteerTime.split(":");
      return dayjs(date).hour(Number(hours)).minute(Number(minutes));
    } catch (error) {
      Logger.error(
        `volunteerTime ${volunteerTime} is not in the correct format`,
      );
    }
  }
  return dayjs(date);
};
