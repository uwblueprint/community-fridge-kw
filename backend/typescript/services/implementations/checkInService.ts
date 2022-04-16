/* eslint-disable class-methods-use-this */
import { snakeCase } from "lodash";
import dayjs from "dayjs";
import { Op } from "sequelize";
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
import { toSnakeCase } from "../../utilities/servicesUtils";
import IVolunteerService from "../interfaces/volunteerService";
import VolunteerService from "./volunteerService";
import ContentService from "./contentService";
import {
  emailFooter,
  emailHeader,
  formatShiftInformation,
  formatVolunteerContactInformation,
  getAdminEmail,
} from "../../utilities/emailUtils";
import IContentService from "../interfaces/contentService";

const Logger = logger(__filename);

class CheckInService implements ICheckInService {
  emailService: IEmailService | null;

  constructor(emailService: IEmailService | null = null) {
    this.emailService = emailService;
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
          start_date: {
            [Op.gte]: new Date(),
          },
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

  async sendVolunteerCheckInSignUpConfirmationEmail(
    volunteerId: string,
    checkIn: CheckInDTO,
    isAdmin: boolean,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendVolunteerCheckInSignUpConfirmationEmail but this instance of CheckInService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const volunteerService: IVolunteerService = new VolunteerService();
      const contentService: IContentService = new ContentService();
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
      } = await volunteerService.getVolunteerById(volunteerId);
      const { checkinUrl } = await contentService.getContent();
      const startTimeToLocalDate = checkIn.startDate.toLocaleString("en-US", {
        timeZone: "EST",
      });
      const startDayString: string = dayjs(startTimeToLocalDate).format(
        "dddd, MMMM D",
      );
      const startTimeString: string = dayjs(startTimeToLocalDate).format(
        "h:mm A",
      );
      const endTimeString: string = dayjs(
        checkIn.endDate.toLocaleString("en-US", {
          timeZone: "EST",
        }),
      ).format("h:mm A");
      const emailBody = `<html>
        ${emailHeader}
        <body>
          ${
            isAdmin
              ? `
        <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">${firstName} ${lastName} has signed up for a Fridge Check-in Shift for 
        ${startDayString} from ${startTimeString} to ${endTimeString}</h2>`
              : `<h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">Hi ${firstName} ${lastName},</h2>
          <p>Thank you for volunteering with us!<br /><br />`
          }
          Here is a shift summary: <br /> <br />
          Food Check-In Instructions: <a href="${checkinUrl}">here</a>
          </p>
          ${formatVolunteerContactInformation(
            firstName,
            lastName,
            phoneNumber,
            email,
          )}
          ${formatShiftInformation(
            startDayString,
            startTimeString,
            endTimeString,
            checkIn.notes ?? "",
          )}
         ${
           !isAdmin
             ? ` <p>
            If you need to cancel your shift, please cancel via your volunteer dashboard here at least 48 hours in advance.
          </p>
         ${emailFooter}`
             : ""
         }
        </body>
      </html>
        `;
      this.emailService.sendEmail(
        isAdmin ? getAdminEmail() : email,
        `Confirmation: Food Check-In Shift for ${startDayString} at ${startTimeString}`,
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email to confirm volunteer sign up for check-in shift for volunteer with id ${volunteerId}`,
      );
      throw error;
    }
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
        volunteerId: updatedCheckIn.volunteer_id
          ? String(updatedCheckIn.volunteer_id)
          : null,
        startDate: updatedCheckIn.start_date,
        endDate: updatedCheckIn.end_date,
        notes: updatedCheckIn.notes,
        isAdmin: updatedCheckIn.is_admin,
      };
      // send volunteer confirmation email
      if (checkIn.hasOwnProperty("volunteerId")) {
        this.sendVolunteerCheckInSignUpConfirmationEmail(
          checkIn.volunteerId!,
          updatedCheckInDTO,
          false,
        );
        this.sendVolunteerCheckInSignUpConfirmationEmail(
          checkIn.volunteerId!,
          updatedCheckInDTO,
          true,
        );
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
}

export default CheckInService;
