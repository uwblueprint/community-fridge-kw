import { snakeCase } from "lodash";
import { DTOTypes } from "../types";

// eslint-disable-next-line import/prefer-default-export
export const toSnakeCase = (dto: DTOTypes): DTOTypes => {
  const dtoSnakeCase: DTOTypes = {};
  Object.entries(dto).forEach(([key, value]) => {
    dtoSnakeCase[snakeCase(key)] = value;
  });
  return dtoSnakeCase;
};
