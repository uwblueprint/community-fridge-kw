/* eslint-disable class-methods-use-this */
import { snakeCase, update } from "lodash";
import dayjs from "dayjs";
import { Op } from "sequelize";
import ICheckInService from "../interfaces/checkInService";
import {
  CheckInDTO,
  CreateCheckInDTO,
  UpdateCheckInDTO,
  DTOTypes,
  UserVolunteerDTO,
} from "../../types";
import logger from "../../utilities/logger";
import CheckIn from "../../models/checkIn.model";
import getErrorMessage from "../../utilities/errorMessageUtil";
import IEmailService from "../interfaces/emailService";
import { toSnakeCase } from "../../utilities/servicesUtils";
import IVolunteerService from "../interfaces/volunteerService";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { emailFooter, emailHeader, getAdminEmail } from "../../utilities/emailUtils";
import IContentService from "../interfaces/contentService";

const Logger = logger(__filename);

class CheckInService implements ICheckInService {
  emailService: IEmailService | null;
  volunteerService: IVolunteerService;
  contentService: IContentService;

  static TEMP_ADMIN_EMAIL = "dorasu@uwblueprint.org";

  constructor(emailService: IEmailService | null = null, volunteerService: IVolunteerService, contentService: IContentService) {
    this.emailService = emailService;
    this.volunteerService = volunteerService;
    this.contentService = contentService;
  }

  async createCheckIn(checkIn: CreateCheckInDTO): Promise<Array<CheckInDTO>> {
    let snakeCaseCheckIns: Array<CheckIn> = [];
    try {
      const checkInsToBeCreated: DTOTypes[] = [];
      const originalStartDate = dayjs(checkIn.startDate);
      const originalEndDate = dayjs(checkIn.endDate);

      let nextStartDate = dayjs(originalStartDate);
      let nextEndDate = dayjs(originalStartDate);

      while (nextEndDate.isBefore(originalEndDate)) {
        const newCheckIn: CreateCheckInDTO = {
          startDate: nextStartDate.toDate(),
          endDate: nextEndDate
            .hour(originalEndDate.hour())
            .minute(originalEndDate.minute())
            .second(originalEndDate.second())
            .millisecond(originalEndDate.millisecond())
            .toDate(),
          notes: checkIn.notes,
          volunteerId: checkIn.volunteerId ? String(checkIn.volunteerId) : null,
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
      const checkInDtos: Array<CheckInDTO> = snakeCaseCheckIns.map(
        (createdCheckIn) => {
          return {
            id: String(createdCheckIn.id),
            startDate: createdCheckIn.start_date,
            endDate: createdCheckIn.end_date,
            notes: createdCheckIn.notes,
            volunteerId: createdCheckIn.volunteer_id
              ? String(createdCheckIn.volunteer_id)
              : null,
            isAdmin: createdCheckIn.is_admin,
          };
        },
      );
      return checkInDtos;
    } catch (error) {
      Logger.error(
        `Failed to create check in. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
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
          volunteerId: checkIn.volunteer_id
            ? String(checkIn.volunteer_id)
            : null,
          isAdmin: checkIn.is_admin,
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get all checkins. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return checkInDtos;
  }

  async getCheckInsById(id: string): Promise<CheckInDTO> {
    let checkIn: CheckIn | null;

    try {
      checkIn = await CheckIn.findByPk(Number(id));

      if (!checkIn) {
        throw new Error(`checkin with id ${id} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to get check in by id. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
      id: String(checkIn.id),
      startDate: checkIn.start_date,
      endDate: checkIn.end_date,
      notes: checkIn.notes,
      volunteerId: checkIn.volunteer_id ? String(checkIn.volunteer_id) : null,
      isAdmin: checkIn.is_admin,
    };
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
          volunteerId: checkIn.volunteer_id
            ? String(checkIn.volunteer_id)
            : null,
          isAdmin: checkIn.is_admin,
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get checkins by volunteer id. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
    return checkInDtos;
  }

  async updateCheckInById(
    checkInId: string,
    checkIn: UpdateCheckInDTO,
  ): Promise<CheckInDTO> {
    try {
      const prevCheckIn: CheckInDTO = await this.getCheckInsById(checkInId);
      const prevVolunteerId = prevCheckIn.volunteerId;

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
        volunteerId: updatedCheckIn.volunteer_id
          ? String(updatedCheckIn.volunteer_id)
          : null,
        startDate: updatedCheckIn.start_date,
        endDate: updatedCheckIn.end_date,
        notes: updatedCheckIn.notes,
        isAdmin: updatedCheckIn.is_admin,
      };

      if (checkIn.volunteerId && !prevVolunteerId) {
        this.sendCheckInSignUpAdminEmail(updatedCheckInDTO);
      }
      
      return updatedCheckInDTO;
    } catch (error) {
      Logger.error(
        `Failed to update check in. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
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

  async sendCheckInSignUpAdminEmail(
    checkIn: CheckInDTO,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to send email regarding volunteer signing up for a check in but this instance of CheckInService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const volunteer: UserVolunteerDTO = await this.volunteerService.getVolunteerById(
      String(checkIn.volunteerId),
    );

    const instructionsLink: string = (await this.contentService.getContent()).checkinUrl;
    // Proposed drop off info

    try {
      const { firstName, lastName, email, phoneNumber } = volunteer;
      const { startDate, endDate } = checkIn;

      const startTimeToLocalDate = startDate.toLocaleString("en-US", { timeZone: "EST", });

      const startDayString: string = dayjs(startTimeToLocalDate).format(
        "dddd, MMMM D",
      );

      const startTimeString: string = dayjs(startTimeToLocalDate).format(
        "h:mm A",
      );
      const endTimeString: string = dayjs(endDate.toLocaleString("en-US", { timeZone: "EST", }),).format("h:mm A");

      dayjs.extend(customParseFormat);

      const emailBody = `
      <html>
      ${emailHeader}
      <body>
         <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;" >
            ${firstName} ${lastName} has signed up for a Check-in Shift for <strong>${startDayString} at ${startTimeString}!</strong>
            <br />
            <br />
            Here is a shift summary:
            <br />
            <br />
            Fridge Check-in Instructions: <a href=${instructionsLink}>todo</a >
            <br />
            <br />
            Shift Information:
            <br />
            Volunteer arrival time: ${startDayString} ${startTimeString} - ${endTimeString}
            <br />
            Additional Notes: ${checkIn.notes}
            <br />
            <br />
            Volunteer Contact Information:
            <br />
            Name: ${firstName} ${lastName}
            <br />
            Email: ${email}
            <br />
            Phone Number: ${phoneNumber}
         </p>
         </body>
         </html>`;

      let subject = `New: Fridge Check-in Shift for ${startDayString} at ${startTimeString}`;
      this.emailService.sendEmail(
        getAdminEmail(),
        subject,
        emailBody,
      );
    } catch (error) {
      const volunteer = await this.volunteerService.getVolunteerById(String(checkIn.volunteerId));
      Logger.error(
        `Failed to generate email to confirm volunteer sign-up for check-in shift for volunteer ${volunteer.firstName} ${volunteer.lastName}`,
      );
      throw error;
    }
  }
}

export default CheckInService;
