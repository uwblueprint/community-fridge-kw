import { snakeCase } from "lodash";
import dayjs from "dayjs";
import { DTOTypes } from "../types";

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
  volunteerTime: string,
): dayjs.Dayjs => {
  const [hours, minutes] = volunteerTime.split(":");
  return dayjs(date).hour(Number(hours)).minute(Number(minutes));
};
