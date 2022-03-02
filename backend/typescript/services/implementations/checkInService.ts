/* eslint-disable class-methods-use-this */
import { snakeCase } from "lodash";
import ICheckInService from "../interfaces/checkInService";
import { CheckInDTO, CreateCheckInDTO, UpdateCheckInDTO } from "../../types";
import logger from "../../utilities/logger";
import CheckIn from "../../models/checkIn.model";
import getErrorMessage from "../../utilities/errorMessageUtil";
import IEmailService from "../interfaces/emailService";
import IVolunteerService from "../interfaces/volunteerService";

const Logger = logger(__filename);

function toSnakeCase(
  checkIn: CreateCheckInDTO,
): Record<string, Date | string | boolean | null | undefined> {
  const checkInSnakeCase: Record<
    string,
    Date | string | boolean | null | undefined
  > = {};
  Object.entries(checkIn).forEach(([key, value]) => {
    checkInSnakeCase[snakeCase(key)] = value;
  });
  return checkInSnakeCase;
}
class CheckInService implements ICheckInService {
  emailService: IEmailService | null;

  volunteerService: IVolunteerService | null;

  static TEMP_ADMIN_EMAIL = "jessiepeng@uwblueprint.org";

  constructor(
    emailService: IEmailService | null = null,
    volunteerService: IVolunteerService | null = null,
  ) {
    this.emailService = emailService;
    this.volunteerService = volunteerService;
  }

  async createCheckIn(checkIn: CreateCheckInDTO): Promise<CheckInDTO> {
    let firstCheckIn: CheckIn;
    try {
      const originalStartDate: Date = new Date(checkIn.startDate);
      const originalEndDate: Date = new Date(checkIn.endDate);

      const nextStartDate: Date = new Date(originalStartDate);
      const nextEndDate: Date = new Date(originalStartDate);

      nextEndDate.setHours(originalEndDate.getHours());
      nextEndDate.setMinutes(originalEndDate.getMinutes());
      nextEndDate.setSeconds(originalEndDate.getSeconds());
      nextEndDate.setSeconds(originalEndDate.getMilliseconds());

      // create first check in
      firstCheckIn = await CheckIn.create({
        start_date: nextStartDate,
        end_date: nextEndDate,
        notes: checkIn.notes,
        volunteer_id: checkIn.volunteerId,
        is_admin: checkIn.isAdmin,
      });

      const checkInsToBeCreated: Record<
        string,
        string | number | boolean | string[] | Date | undefined | null
      >[] = [];

      while (nextEndDate.valueOf() < originalEndDate.valueOf()) {
        nextStartDate.setDate(nextStartDate.getDate() + 1);
        nextEndDate.setDate(nextEndDate.getDate() + 1);

        const newCheckIn: CreateCheckInDTO = {
          startDate: nextStartDate,
          endDate: nextEndDate,
          notes: checkIn.notes,
          volunteerId: checkIn.volunteerId,
          isAdmin: checkIn.isAdmin,
        };

        const snakeCaseNewCheckIn: Record<
          string,
          Date | string | boolean | null | undefined
        > = toSnakeCase(newCheckIn);

        checkInsToBeCreated.push(snakeCaseNewCheckIn);
      }
      await CheckIn.bulkCreate(checkInsToBeCreated);
    } catch (error) {
      Logger.error(
        `Failed to create check in. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    const retNewCheckIn: CheckInDTO = {
      id: String(firstCheckIn.id),
      startDate: firstCheckIn.start_date,
      endDate: firstCheckIn.end_date,
      notes: firstCheckIn.notes,
      volunteerId: String(firstCheckIn.volunteer_id),
      isAdmin: firstCheckIn.is_admin,
    };

    return retNewCheckIn;
  }

  async updateCheckInById(
    checkInId: string,
    checkIn: UpdateCheckInDTO,
  ): Promise<CheckInDTO> {
    try {
      const updatesSnakeCase: Record<string, unknown> = {};
      Object.entries(checkIn).forEach(([key, value]) => {
        updatesSnakeCase[snakeCase(key)] = value;
      });
      const updateResult = await CheckIn.update(updatesSnakeCase, {
        where: { id: Number(checkInId) },
        returning: true,
      });
      if (updateResult[0] < 1) {
        throw new Error(`checkInId ${checkInId} not found.`);
      }
      const updatedCheckIn = updateResult[1][0];

      const updatedCheckInDTO: CheckInDTO = {
        id: String(updatedCheckIn.id),
        volunteerId: String(updatedCheckIn.volunteer_id),
        startDate: updatedCheckIn.start_date,
        endDate: updatedCheckIn.end_date,
        notes: updatedCheckIn.notes,
        isAdmin: updatedCheckIn.is_admin,
      };
      return updatedCheckInDTO;
    } catch (error) {
      Logger.error(
        `Failed to update check in. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default CheckInService;
