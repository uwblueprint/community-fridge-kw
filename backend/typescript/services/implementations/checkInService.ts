/* eslint-disable class-methods-use-this */
import { snakeCase } from "lodash";
import dayjs from "dayjs";
import ICheckInService from "../interfaces/checkInService";
import {
  CheckInDTO,
  CreateCheckInDTO,
  UpdateCheckInDTO,
  DTOTypes,
} from "../../types";
import logger from "../../utilities/logger";
import CheckIn from "../../models/checkIn.model";
import getErrorMessage from "../../utilities/errorMessageUtil";
import IEmailService from "../interfaces/emailService";
import IVolunteerService from "../interfaces/volunteerService";
import { toSnakeCase } from "../../utilities/servicesUtils";

const Logger = logger(__filename);

class CheckInService implements ICheckInService {
  emailService: IEmailService | null;

  volunteerService: IVolunteerService | null;

  constructor(
    emailService: IEmailService | null = null,
    volunteerService: IVolunteerService | null = null,
  ) {
    this.emailService = emailService;
    this.volunteerService = volunteerService;
  }

  async createCheckIn(checkIn: CreateCheckInDTO): Promise<Array<CheckInDTO>> {
    let snakeCaseCheckIns: Array<CheckIn> = [];
    try {
      const checkInsToBeCreated: DTOTypes[] = [];
      const originalStartDate = dayjs(checkIn.startDate);
      const originalEndDate = dayjs(checkIn.endDate);

      let nextStartDate = dayjs(originalStartDate);
      let nextEndDate = dayjs(originalStartDate);

      console.log(checkIn.startDate);
      console.log(`next end date: ${nextEndDate.toDate()}`);
      console.log(`original end date: ${originalEndDate.toDate()}`);
      console.log(checkIn.endDate);

      nextEndDate = nextEndDate
        .hour(originalEndDate.hour())
        .minute(originalEndDate.minute())
        .second(originalEndDate.second())
        .millisecond(originalEndDate.millisecond());

      while (nextEndDate.isBefore(originalEndDate)) {
        console.log(`next end date: ${nextEndDate.toDate()}`);
        console.log(`original end date: ${originalEndDate.toDate()}`);

        const newCheckIn: CreateCheckInDTO = {
          startDate: nextStartDate.toDate(),
          endDate: nextEndDate.toDate(),
          notes: checkIn.notes,
          volunteerId: checkIn.volunteerId,
          isAdmin: checkIn.isAdmin,
        };

        const snakeCaseNewCheckIn: Record<
          string,
          Date | string | string[] | boolean | number | null | undefined
        > = toSnakeCase(newCheckIn);

        checkInsToBeCreated.push(snakeCaseNewCheckIn);

        nextStartDate = nextStartDate.add(1, "day");
        nextEndDate = nextEndDate.add(1, "day");
      }
      snakeCaseCheckIns = await CheckIn.bulkCreate(checkInsToBeCreated);
    } catch (error) {
      Logger.error(
        `Failed to create check in. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    const checkInDtos: Array<CheckInDTO> = snakeCaseCheckIns.map(
      (createdCheckIn) => {
        return {
          id: String(createdCheckIn.id),
          startDate: createdCheckIn.start_date,
          endDate: createdCheckIn.end_date,
          notes: createdCheckIn.notes,
          volunteerId: String(createdCheckIn.volunteer_id),
          isAdmin: createdCheckIn.is_admin,
        };
      },
    );

    return checkInDtos;
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
        limit: 1,
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
