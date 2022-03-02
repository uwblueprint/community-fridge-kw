import { Op } from "sequelize";
import { CheckInDTO } from "../../types";
import ICheckInService from "../interfaces/checkInService";
import logger from "../../utilities/logger";
import CheckIn from "../../models/checkIn.model";
import getErrorMessage from "../../utilities/errorMessageUtil";
import IEmailService from "../interfaces/emailService";
import IVolunteerService from "../interfaces/volunteerService";

const Logger = logger(__filename);

class CheckInService implements ICheckInService {
  /* eslint-disable class-methods-use-this */

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

  async getAllCheckIns(): Promise<CheckInDTO[]> {
    let checkInDtos: CheckInDTO[] = [];
    try {
      const checkIns = await CheckIn.findAll({
        order: [["start_date", "ASC"]],
      });
      checkInDtos = checkIns.map((checkIn: CheckIn) => {
        return {
          id: String(checkIn.id),
          startDate: checkIn.start_date,
          endDate: checkIn.end_date,
          notes: checkIn.notes,
          volunteerId: String(checkIn.volunteer_id),
          isAdmin: checkIn.is_admin,
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get all checkins. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    console.log(checkInDtos);
    return checkInDtos;
  }

  async getCheckInsById(id: string): Promise<CheckInDTO> {
    let checkIn: CheckIn | null;

    try {
      checkIn = await CheckIn.findByPk(Number(id));

      if (!checkIn) {
        throw new Error(`scheduling with id ${id} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to get check in by id. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    const haha = {
      id: String(checkIn.id),
      startDate: checkIn.start_date,
      endDate: checkIn.end_date,
      notes: checkIn.notes,
      volunteerId: String(checkIn.volunteer_id),
      isAdmin: checkIn.is_admin,
    };
    console.log(haha);
    return haha;
  }

  async getCheckInsByVolunteerId(volunteerId: string): Promise<CheckInDTO[]> {
    let checkInDtos: CheckInDTO[] = [];
    let checkIns: CheckIn[];
    try {
      checkIns = await CheckIn.findAll({
        where: {
          volunteer_id: Number(volunteerId),
        },
        order: [["start_date", "ASC"]],
      });

      checkInDtos = checkIns.map((checkIn) => {
        return {
          id: String(checkIn.id),
          startDate: checkIn.start_date,
          endDate: checkIn.end_date,
          notes: checkIn.notes,
          volunteerId: String(checkIn.volunteer_id),
          isAdmin: checkIn.is_admin,
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get schedules by volunteer id. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }

    console.log(checkInDtos);
    return checkInDtos;
  }

  async deleteCheckInById(id: string): Promise<void> {
    try {
      const numDestroyed = await CheckIn.destroy({
        where: { id: Number(id) },
      });
      if (numDestroyed <= 0) {
        throw new Error(`checkin with id ${id} was not deleted.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to delete checkin by id. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteCheckInsByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<void> {
    const startDateRange = new Date(startDate);
    const endDateRange = new Date(endDate);

    try {
      const numsDestroyed = await CheckIn.destroy({
        where: {
          start_date: {
            [Op.gte]: startDateRange,
          },
          end_date: {
            [Op.lte]: endDateRange,
          },
        },
      });
      if (numsDestroyed <= 0) {
        throw new Error(
          `checkins between start date ${startDate} and end date ${endDate} were not deleted.`,
        );
      }
    } catch (error) {
      Logger.error(
        `Failed to delete checkins by start and end date range. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default CheckInService;
