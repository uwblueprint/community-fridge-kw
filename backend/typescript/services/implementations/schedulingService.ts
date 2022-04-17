/* eslint-disable class-methods-use-this */
import { snakeCase } from "lodash";
import { Op } from "sequelize";
import dayjs from "dayjs";
import ordinal from "ordinal";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ISchedulingService from "../interfaces/schedulingService";
import IEmailService from "../interfaces/emailService";
import IDonorService from "../interfaces/donorService";
import IVolunteerService from "../interfaces/volunteerService";
import {
  SchedulingDTO,
  CreateSchedulingDTO,
  UpdateSchedulingDTO,
  Frequency,
  UserDonorDTO,
  donationSizeDescriptions,
} from "../../types";
import logger from "../../utilities/logger";
import Scheduling from "../../models/scheduling.model";
import getErrorMessage from "../../utilities/errorMessageUtil";
import { toSnakeCase } from "../../utilities/servicesUtils";
import {
  cancellationEmail,
  getAdminEmail,
  emailHeader,
  emailFooter,
  formatVolunteerContactInformation,
  formatDonorContactInformation,
  formatFoodRescueShiftInformation,
} from "../../utilities/emailUtils";
// eslint-disable-next-line
import VolunteerService from "./volunteerService";
import IContentService from "../interfaces/contentService";
import ContentService from "./contentService";

const Logger = logger(__filename);

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("America/New_York");

class SchedulingService implements ISchedulingService {
  emailService: IEmailService | null;

  donorService: IDonorService;

  volunteerService: IVolunteerService;

  constructor(
    emailService: IEmailService | null = null,
    donorService: IDonorService,
    volunteerService: IVolunteerService,
  ) {
    this.emailService = emailService;
    this.donorService = donorService;
    this.volunteerService = volunteerService;
  }

  async getSchedulingById(id: string): Promise<SchedulingDTO> {
    let scheduling: Scheduling | null;

    try {
      scheduling = await Scheduling.findByPk(Number(id));

      if (!scheduling) {
        throw new Error(`scheduling with id ${id} not found.`);
      }
    } catch (error) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: String(scheduling.id),
      donorId: String(scheduling.donor_id),
      categories: scheduling.categories,
      size: scheduling.size,
      isPickup: scheduling.is_pickup,
      pickupLocation: scheduling.pickup_location,
      dayPart: scheduling.day_part,
      startTime: scheduling.start_time,
      endTime: scheduling.end_time,
      status: scheduling.status,
      volunteerNeeded: scheduling.volunteer_needed,
      volunteerTime: scheduling.volunteer_time,
      frequency: scheduling.frequency,
      recurringDonationId: scheduling.recurring_donation_id
        ? String(scheduling.recurring_donation_id)
        : null,
      recurringDonationEndDate: scheduling.recurring_donation_end_date,
      notes: scheduling.notes,
      volunteerId: scheduling.volunteer_id
        ? String(scheduling.volunteer_id)
        : null,
    };
  }

  async getSchedulingsByDonorId(
    donorId: string,
    weekLimit: number,
  ): Promise<Array<SchedulingDTO>> {
    let schedulingDtos: Array<SchedulingDTO> = [];
    let schedulings: Array<Scheduling>;
    try {
      const currentStartDate = new Date();
      if (weekLimit !== 0) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + weekLimit * 7);
        schedulings = await Scheduling.findAll({
          where: {
            donor_id: Number(donorId),
            start_time: {
              [Op.between]: [currentStartDate, nextDate],
            },
          },
          order: [["start_time", "ASC"]],
        });
      } else {
        schedulings = await Scheduling.findAll({
          where: {
            donor_id: Number(donorId),
            start_time: {
              [Op.gte]: currentStartDate,
            },
          },
          order: [["start_time", "ASC"]],
        });
      }

      schedulingDtos = schedulings.map((scheduling) => {
        return {
          id: String(scheduling.id),
          donorId: String(scheduling.donor_id),
          categories: scheduling.categories,
          size: scheduling.size,
          isPickup: scheduling.is_pickup,
          pickupLocation: scheduling.pickup_location,
          dayPart: scheduling.day_part,
          startTime: scheduling.start_time,
          endTime: scheduling.end_time,
          status: scheduling.status,
          volunteerNeeded: scheduling.volunteer_needed,
          volunteerTime: scheduling.volunteer_time,
          frequency: scheduling.frequency,
          recurringDonationId: scheduling.recurring_donation_id
            ? String(scheduling.recurring_donation_id)
            : null,
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
          volunteerId: scheduling.volunteer_id
            ? String(scheduling.volunteer_id)
            : null,
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get schedules. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return schedulingDtos;
  }

  async getSchedulingsByVolunteersNeeded(
    isVolunteerSlotFilled?: boolean,
  ): Promise<SchedulingDTO[]> {
    let schedulingDtos: Array<SchedulingDTO> = [];
    try {
      const volunteerIdQuery = isVolunteerSlotFilled ? { [Op.ne]: null } : null;
      const schedulings: Array<Scheduling> = await Scheduling.findAll({
        where:
          isVolunteerSlotFilled === undefined
            ? {
                volunteer_needed: true,
              }
            : {
                volunteer_needed: true,
                volunteer_id: volunteerIdQuery,
              },
        order: [["start_time", "ASC"]],
      });
      schedulingDtos = schedulings.map((scheduling) => {
        return {
          id: String(scheduling.id),
          donorId: String(scheduling.donor_id),
          categories: scheduling.categories,
          size: scheduling.size,
          isPickup: scheduling.is_pickup,
          pickupLocation: scheduling.pickup_location,
          dayPart: scheduling.day_part,
          startTime: scheduling.start_time,
          endTime: scheduling.end_time,
          status: scheduling.status,
          volunteerNeeded: scheduling.volunteer_needed,
          volunteerTime: scheduling.volunteer_time,
          frequency: scheduling.frequency,
          recurringDonationId: scheduling.recurring_donation_id
            ? String(scheduling.recurring_donation_id)
            : null,
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
          volunteerId: scheduling.volunteer_id
            ? String(scheduling.volunteer_id)
            : null,
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get schedulings by volunteers needed. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }

    return schedulingDtos;
  }

  async getSchedulings(): Promise<Array<SchedulingDTO>> {
    let schedulingDtos: Array<SchedulingDTO> = [];
    try {
      const schedulings: Array<Scheduling> = await Scheduling.findAll({
        order: [["start_time", "ASC"]],
      });
      schedulingDtos = schedulings.map((scheduling) => {
        return {
          id: String(scheduling.id),
          donorId: String(scheduling.donor_id),
          categories: scheduling.categories,
          size: scheduling.size,
          isPickup: scheduling.is_pickup,
          pickupLocation: scheduling.pickup_location,
          dayPart: scheduling.day_part,
          startTime: scheduling.start_time,
          endTime: scheduling.end_time,
          status: scheduling.status,
          volunteerNeeded: scheduling.volunteer_needed,
          volunteerTime: scheduling.volunteer_time,
          frequency: scheduling.frequency,
          recurringDonationId: scheduling.recurring_donation_id
            ? String(scheduling.recurring_donation_id)
            : null,
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
          volunteerId: scheduling.volunteer_id
            ? String(scheduling.volunteer_id)
            : null,
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get schedulings. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return schedulingDtos;
  }

  async getSchedulingsByPickUp(isPickUp: boolean): Promise<SchedulingDTO[]> {
    let schedulingDtos: Array<SchedulingDTO> = [];
    try {
      const schedulings: Array<Scheduling> = await Scheduling.findAll({
        where: { is_pickup: isPickUp, volunteer_needed: true },
        order: [["start_time", "ASC"]],
      });
      schedulingDtos = schedulings.map((scheduling) => {
        return {
          id: String(scheduling.id),
          donorId: String(scheduling.donor_id),
          categories: scheduling.categories,
          size: scheduling.size,
          isPickup: scheduling.is_pickup,
          pickupLocation: scheduling.pickup_location,
          dayPart: scheduling.day_part,
          startTime: scheduling.start_time,
          endTime: scheduling.end_time,
          status: scheduling.status,
          volunteerNeeded: scheduling.volunteer_needed,
          volunteerTime: scheduling.volunteer_time,
          frequency: scheduling.frequency,
          recurringDonationId: scheduling.recurring_donation_id
            ? String(scheduling.recurring_donation_id)
            : null,
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
          volunteerId: scheduling.volunteer_id
            ? String(scheduling.volunteer_id)
            : null,
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get schedulings by pickup needed. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }

    return schedulingDtos;
  }

  async sendScheduledDonationEmail(
    updated: boolean,
    schedule: SchedulingDTO,
    isAdmin: boolean,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to send email regarding schedule creation/changes but this instance of SchedulingService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const currDonor: UserDonorDTO = await this.donorService.getDonorById(
      String(schedule.donorId),
    );

    // Proposed drop off info

    try {
      const { firstName, lastName, email } = currDonor;
      const { startTime, endTime } = schedule;

      const startDayString: string = dayjs.tz(startTime).format("dddd, MMMM D");

      const startTimeString: string = dayjs.tz(startTime).format("h:mm A");
      const endTimeString: string = dayjs.tz(endTime).format("h:mm A");

      // frequency string
      // e.g. Weekly on <day of week> until <recurringDonationEndDate>
      let frequencyString = "One-time donation";
      if (schedule.frequency !== Frequency.ONE_TIME) {
        if (schedule.frequency === Frequency.DAILY) {
          frequencyString = `Daily`;
        } else if (schedule.frequency === Frequency.WEEKLY) {
          frequencyString = `Weekly on ${dayjs.tz(startTime).format("dddd")}`;
        } else {
          frequencyString = `Monthly on the ${ordinal(
            Number(dayjs.tz(startTime).format("D")),
          )}`;
        }
      }

      dayjs.extend(customParseFormat);

      const volunteerTimeString =
        dayjs(schedule.volunteerTime, "HH:mm").format("h:mm A") ?? "";

      const emailBody = `
        <html>
          ${emailHeader}
          <body>
              
              <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
              
              ${
                updated
                  ? `Your community fridge donation has been edited.
                    <br />
                    The following details have been updated:
                    </p>`
                  : ``
              }

              ${
                isAdmin
                  ? `${firstName} ${lastName} has scheduled a donation for <strong> ${startDayString} at ${startTimeString}!</strong></p>	
                    <br />`
                  : ``
              }

              ${
                !updated && !isAdmin
                  ? `<strong>Hey there ${firstName}!</strong>
                  <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Thank you for scheduling a donation to your local community fridge.
                            <br />
                            <br />
                      Here is a summary of your upcoming donation:`
                  : ``
              }
              
     
              <table style="display: block; margin-top: 2em; justify-content: space-between; max-width: 800px;">
                <tr>
                  <td style="display: inline-block; padding-right: 2em; vertical-align: top;">
                    <h2 style="margin: 0; font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">
                      Proposed drop-off time
                    </h2>
                    <p style="margin: 0.5em 0 1.5em 0; max-width: 400px; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
                      ${startDayString}
                      <br />
                      ${startTimeString} - ${endTimeString}
                      <br />
                      ${frequencyString}
                    </p>
                  </td>
                  <td style="display: inline-block; padding-right: 2em; vertical-align: top;">
                    <h2 style="margin: 0; font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">Donation information</h2>
                    <p style="margin: 0.5em 0 1.5em 0; max-width: 400px; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
                      ${schedule.size} - ${donationSizeDescriptions.get(
        schedule.size ?? "",
      )}
                    <br />
                      ${schedule.categories.join(", ")}
                    </p>
                  </td>
              </tr>
              <tr>
                <td style="display: inline-block; padding-right: 2em; vertical-align: top;">
                  <h2 style="margin: 0; font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">Volunteer information</h2>
                  <p style="margin: 0.5em 0 1.5em 0; max-width: 400px; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
                    ${
                      schedule.volunteerNeeded
                        ? `<strong>Volunteer required at ${volunteerTimeString}</strong>`
                        : "Volunteer not required"
                    }
                    <br />
                    ${
                      schedule.isPickup
                        ? "Pickup required"
                        : "Pickup not required"
                    }
                    <br />
                    ${
                      schedule.isPickup
                        ? `${schedule.pickupLocation}<br />`
                        : ""
                    }
                    ${
                      schedule.notes
                        ? `Additional Notes: ${schedule.notes}`
                        : ""
                    }
                  </p>
                </td>
              </tr>
            </table>
     ${
       updated
         ? `<p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">If this is an error, please contact the CFKW admin team.</p>`
         : ""
     }
     ${emailFooter}
     </body>
     </html>
      `;

      let subject = "Your Donation Information";

      if (updated) {
        subject = `DONATION EDITED - Donation on ${startDayString}`;
      }

      if (isAdmin) {
        subject = `New Donation Booked - ${startDayString}, ${startTimeString} - ${endTimeString}`;
      }

      this.emailService.sendEmail(
        isAdmin ? getAdminEmail() : email,
        subject,
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email to confirm ${
          updated ? "updated" : ""
        } donation details of donation scheduled by ${currDonor.email}`,
      );
      throw error;
    }
  }

  async createScheduling(
    scheduling: CreateSchedulingDTO,
  ): Promise<SchedulingDTO> {
    let newScheduling: Scheduling;
    try {
      const schedulingFrequency = scheduling.frequency;
      if (schedulingFrequency === Frequency.ONE_TIME) {
        newScheduling = await Scheduling.create({
          donor_id: scheduling.donorId,
          categories: scheduling.categories,
          size: scheduling.size,
          is_pickup: scheduling.isPickup,
          pickup_location: scheduling.pickupLocation,
          day_part: scheduling.dayPart,
          start_time: scheduling.startTime,
          end_time: scheduling.endTime,
          status: scheduling.status,
          volunteer_needed: scheduling.volunteerNeeded,
          volunteer_time: scheduling.volunteerTime,
          frequency: scheduling.frequency,
          recurring_donation_id: scheduling.recurringDonationId,
          recurring_donation_end_date: scheduling.recurringDonationEndDate,
          notes: scheduling.notes,
          volunteer_id: scheduling.volunteerId,
        });
      } else {
        // get new recurring donation id
        let newRecurringDonationId: number | null = await Scheduling.max(
          "recurring_donation_id",
        );
        newRecurringDonationId =
          newRecurringDonationId === null ||
          Number.isNaN(newRecurringDonationId)
            ? 1
            : newRecurringDonationId + 1;

        // end date of recurring donation
        const recurringDonationEndDate = dayjs(
          scheduling.recurringDonationEndDate!,
        );

        // create first schedule and assign it to newScheduling
        newScheduling = await Scheduling.create({
          donor_id: scheduling.donorId,
          categories: scheduling.categories,
          size: scheduling.size,
          is_pickup: scheduling.isPickup,
          pickup_location: scheduling.pickupLocation,
          day_part: scheduling.dayPart,
          start_time: scheduling.startTime,
          end_time: scheduling.endTime,
          status: scheduling.status,
          volunteer_needed: scheduling.volunteerNeeded,
          volunteer_time: scheduling.volunteerTime,
          frequency: scheduling.frequency,
          recurring_donation_id: newRecurringDonationId,
          recurring_donation_end_date: scheduling.recurringDonationEndDate,
          notes: scheduling.notes,
          volunteer_id: scheduling.volunteerId,
        });

        const schedulesToBeCreated: Record<
          string,
          string | number | boolean | string[] | Date | undefined | null
        >[] = [];

        let nextDayStartTime = dayjs(scheduling.startTime);
        let nextDayEndTime = dayjs(scheduling.endTime);
        // loop for calculations if frequency is DAILY
        if (schedulingFrequency === Frequency.DAILY) {
          nextDayStartTime = nextDayStartTime.add(1, "day");
          nextDayEndTime = nextDayEndTime.add(1, "day");

          while (nextDayStartTime.isBefore(recurringDonationEndDate)) {
            const newSchedule: CreateSchedulingDTO = {
              ...scheduling,
              startTime: nextDayStartTime.toDate(),
              endTime: nextDayEndTime.toDate(),
              recurringDonationId: String(newRecurringDonationId),
            };
            const snakeCaseNewSchedule: Record<
              string,
              Date | string | string[] | boolean | number | null | undefined
            > = toSnakeCase(newSchedule);

            schedulesToBeCreated.push(snakeCaseNewSchedule);
            nextDayStartTime = nextDayStartTime.add(1, "day");
            nextDayEndTime = nextDayEndTime.add(1, "day");
          }
          await Scheduling.bulkCreate(schedulesToBeCreated);
        }
        // loop for calculations if frequency is WEEKLY
        else if (schedulingFrequency === Frequency.WEEKLY) {
          nextDayStartTime = nextDayStartTime.add(7, "day");
          nextDayEndTime = nextDayEndTime.add(7, "day");

          while (nextDayStartTime.isBefore(recurringDonationEndDate)) {
            const newSchedule: CreateSchedulingDTO = {
              ...scheduling,
              startTime: nextDayStartTime.toDate(),
              endTime: nextDayEndTime.toDate(),
              recurringDonationId: String(newRecurringDonationId),
            };
            const snakeCaseNewSchedule: Record<
              string,
              string | string[] | boolean | number | Date | undefined | null
            > = toSnakeCase(newSchedule);

            schedulesToBeCreated.push(snakeCaseNewSchedule);
            nextDayStartTime = nextDayStartTime.add(7, "day");
            nextDayEndTime = nextDayEndTime.add(7, "day");
          }
          await Scheduling.bulkCreate(schedulesToBeCreated);
        }
        // loop for calculations if frequency is MONTHLY
        else {
          nextDayStartTime = nextDayStartTime.add(28, "day");
          nextDayEndTime = nextDayEndTime.add(28, "day");

          while (nextDayStartTime.isBefore(recurringDonationEndDate)) {
            const newSchedule: CreateSchedulingDTO = {
              ...scheduling,
              startTime: nextDayStartTime.toDate(),
              endTime: nextDayEndTime.toDate(),
              recurringDonationId: String(newRecurringDonationId),
            };
            const snakeCaseNewSchedule: Record<
              string,
              string | string[] | boolean | number | Date | undefined | null
            > = toSnakeCase(newSchedule);

            schedulesToBeCreated.push(snakeCaseNewSchedule);
            nextDayStartTime = nextDayStartTime.add(28, "day");
            nextDayEndTime = nextDayEndTime.add(28, "day");
          }
          await Scheduling.bulkCreate(schedulesToBeCreated);
        }
      }
    } catch (error) {
      Logger.error(
        `Failed to create scheduling. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    const retNewSchedule: SchedulingDTO = {
      id: String(newScheduling.id),
      donorId: String(newScheduling.donor_id),
      categories: newScheduling.categories,
      size: newScheduling.size,
      isPickup: newScheduling.is_pickup,
      pickupLocation: newScheduling.pickup_location,
      dayPart: newScheduling.day_part,
      startTime: newScheduling.start_time,
      endTime: newScheduling.end_time,
      status: newScheduling.status,
      volunteerNeeded: newScheduling.volunteer_needed,
      volunteerTime: newScheduling.volunteer_time,
      frequency: newScheduling.frequency,
      recurringDonationId: String(newScheduling.recurring_donation_id),
      recurringDonationEndDate: newScheduling.recurring_donation_end_date,
      notes: newScheduling.notes,
      volunteerId: String(newScheduling.volunteer_id),
    };

    // send email
    this.sendScheduledDonationEmail(false, retNewSchedule, false);
    this.sendScheduledDonationEmail(false, retNewSchedule, true);

    return retNewSchedule;
  }

  // TODO: handle case when times are updated (change status to pending?)
  async updateSchedulingById(
    schedulingId: string,
    scheduling: UpdateSchedulingDTO,
  ): Promise<SchedulingDTO> {
    try {
      const updatesSnakeCase: Record<string, unknown> = {};
      Object.entries(scheduling).forEach(([key, value]) => {
        updatesSnakeCase[snakeCase(key)] = value;
      });
      const oldScheduling = await Scheduling.findOne({
        where: { id: schedulingId },
      });
      const updateResult = await Scheduling.update(updatesSnakeCase, {
        where: { id: Number(schedulingId) },
        returning: true,
      });
      if (updateResult[0] < 1) {
        throw new Error(`schedulingId ${schedulingId} not found.`);
      }
      const updatedScheduling = updateResult[1][0];

      const updatedSchedulingDTO: SchedulingDTO = {
        id: String(updatedScheduling.id),
        donorId: String(updatedScheduling.donor_id),
        categories: updatedScheduling.categories,
        size: updatedScheduling.size,
        isPickup: updatedScheduling.is_pickup,
        pickupLocation: updatedScheduling.pickup_location,
        dayPart: updatedScheduling.day_part,
        startTime: updatedScheduling.start_time,
        endTime: updatedScheduling.end_time,
        status: updatedScheduling.status,
        volunteerNeeded: updatedScheduling.volunteer_needed,
        volunteerTime: updatedScheduling.volunteer_time,
        frequency: updatedScheduling.frequency,
        recurringDonationId: String(updatedScheduling.recurring_donation_id),
        recurringDonationEndDate: updatedScheduling.recurring_donation_end_date,
        notes: updatedScheduling.notes,
        volunteerId: String(updatedScheduling.volunteer_id),
      };
      // send volunteer email confirmation if signed up for food rescue
      if (
        Object.prototype.hasOwnProperty.call(scheduling, "volunteerId") &&
        scheduling.volunteerId
      ) {
        this.sendVolunteerSchedulingSignUpConfirmationEmail(
          scheduling.volunteerId,
          updatedSchedulingDTO,
          true,
        );
        this.sendVolunteerSchedulingSignUpConfirmationEmail(
          scheduling.volunteerId,
          updatedSchedulingDTO,
          false,
        );
      }
      // send cancellation email if volunteer has cancelled
      if (
        Object.prototype.hasOwnProperty.call(scheduling, "volunteerId") &&
        updatedScheduling.volunteer_id === null &&
        oldScheduling?.volunteer_id
      ) {
        this.sendVolunteerShiftCancellationEmail(
          String(oldScheduling.volunteer_id),
          updatedSchedulingDTO,
          true,
        );
        this.sendVolunteerShiftCancellationEmail(
          String(oldScheduling.volunteer_id),
          updatedSchedulingDTO,
          false,
        );
      }
      return updatedSchedulingDTO;
    } catch (error) {
      Logger.error(
        `Failed to update scheduling. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async sendSchedulingCancellationEmail(
    schedule: SchedulingDTO,
    isRecurringDonation: boolean,
    isAdminDeleted: boolean,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendEmailAfterSchedulingCancellation but this instance of SchedulingService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const { startTime, donorId, volunteerId } = schedule;
      const donor = await this.donorService.getDonorById(donorId);
      const startDayString: string = dayjs.tz(startTime).format("dddd, MMMM D");
      const startTimeString: string = dayjs.tz(startTime).format("h:mm A");

      // if admin deleted on behalf of donor
      if (isAdminDeleted) {
        const donorMainLine = `Your donation scheduled for ${startDayString} at ${startTimeString}${
          isRecurringDonation ? " and all following donations" : ""
        } has been cancelled by Community Fridge KW admin.`;
        const adminMainLine = `The scheduled donation by ${
          donor.businessName
        } for ${startDayString} at ${startTimeString}${
          isRecurringDonation ? " and all following donations" : ""
        } has been cancelled.`;

        this.emailService.sendEmail(
          donor.email,
          "Donation Cancelled By Community Fridge KW Admin",
          cancellationEmail(donorMainLine, donor.firstName),
        );
        this.emailService.sendEmail(
          getAdminEmail(),
          `${donor.businessName} Donation Cancellation Confirmation`,
          cancellationEmail(adminMainLine, "Community Fridge KW"),
        );
        // if donor deleted their own donation
      } else {
        const donorMainLine = `Your donation scheduled for ${startDayString} at ${startTimeString}${
          isRecurringDonation ? " and all following donations" : ""
        } has been cancelled.`;
        const adminMainLine = `${
          donor.businessName
        } has cancelled their scheduled donation for ${startDayString} at ${startTimeString}${
          isRecurringDonation ? " and all following donations" : ""
        }!`;

        this.emailService.sendEmail(
          donor.email,
          "Donation Cancellation Confirmation",
          cancellationEmail(donorMainLine, donor.firstName),
        );
        this.emailService.sendEmail(
          getAdminEmail(),
          `${donor.businessName} Donation Cancellation`,
          cancellationEmail(adminMainLine, "Community Fridge KW"),
        );
      }
    } catch (error) {
      const donor = await this.donorService.getDonorById(schedule.donorId);
      Logger.error(
        `Failed to generate email to confirm donation cancellation of donation scheduled by ${donor.email}`,
      );
      throw error;
    }
  }

  async sendVolunteerSchedulingSignUpConfirmationEmail(
    volunteerId: string,
    scheduling: SchedulingDTO,
    isAdmin: boolean,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendVolunteerSchedulingSignUpConfirmationEmail but this instance of SchedulingService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const volunteerService: IVolunteerService = new VolunteerService();
      const contentService: IContentService = new ContentService();
      const { foodRescueUrl } = await contentService.getContent();
      const {
        firstName,
        lastName,
        phoneNumber,
        email,
      } = await volunteerService.getVolunteerById(volunteerId);
      const donor = await this.donorService.getDonorById(scheduling.donorId);
      dayjs.extend(customParseFormat);
      const startDayString: string = dayjs
        .tz(scheduling.startTime)
        .format("dddd, MMMM D");
      const volunteerStartTime: string = dayjs(
        scheduling.volunteerTime,
        "HH:mm",
      ).format("h:mm A");
      const emailBody = `<html>
        ${emailHeader}
        <body>
        ${
          isAdmin
            ? `
      <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">${firstName} ${lastName} has signed up for a Food Rescue shift for 
      ${startDayString} at ${volunteerStartTime}</h2>`
            : `<h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">Hi ${firstName} ${lastName},</h2>
        <p>Thank you for volunteering with us!<br /><br />`
        }
          Here is a summary of your upcoming shift: <br /> <br />
          Food Rescue Instructions:  <a href="${foodRescueUrl}">here</a>
          </p>
         ${formatFoodRescueShiftInformation(
           scheduling.isPickup,
           scheduling.pickupLocation ?? "",
           startDayString,
           volunteerStartTime,
           scheduling.notes ?? "",
         )}
          ${formatVolunteerContactInformation(
            firstName,
            lastName,
            phoneNumber,
            email,
          )}
          ${formatDonorContactInformation(
            donor.firstName,
            donor.lastName,
            donor.phoneNumber,
            donor.email,
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
        `Confirmation: Food Rescue Shift for ${startDayString} at ${volunteerStartTime}`,
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email to confirm volunteer sign up for food rescue shift for volunteer with id ${volunteerId}`,
      );
      throw error;
    }
  }

  async updateSchedulingByRecurringDonationId(
    recurringDonationId: string,
    scheduling: UpdateSchedulingDTO,
  ): Promise<void> {
    try {
      const updatesSnakeCase: Record<
        string,
        Date | string | number | boolean | string[] | undefined | null
      > = {};
      const startDateTime = new Date(scheduling.startTime!);
      Object.entries(scheduling).forEach(([key, value]) => {
        if (key !== "startTime") {
          updatesSnakeCase[snakeCase(key)] = value;
        }
      });

      const updateResult = await Scheduling.update(updatesSnakeCase, {
        where: {
          recurring_donation_id: Number(recurringDonationId),
          start_time: {
            [Op.gte]: startDateTime,
          },
        },
        returning: true,
      });
      if (updateResult[0] < 1) {
        throw new Error(
          `recurringDonationId ${recurringDonationId} not found.`,
        );
      }
    } catch (error) {
      Logger.error(
        `Failed to update scheduling. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteSchedulingById(id: string, role: string): Promise<void> {
    try {
      const schedule = await this.getSchedulingById(id);
      const numDestroyed = await Scheduling.destroy({
        where: { id: Number(id) },
      });
      if (numDestroyed <= 0) {
        throw new Error(`scheduling with id ${id} was not deleted.`);
      }
      if (role === "Admin") {
        this.sendSchedulingCancellationEmail(schedule, false, true);
      } else {
        this.sendSchedulingCancellationEmail(schedule, false, false);
      }
      if (schedule.volunteerId)
        this.sendVolunteerFoodRescueCancellationEmail(
          schedule.volunteerId,
          schedule,
        );
    } catch (error) {
      Logger.error(
        `Failed to delete scheduling. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteSchedulingByRecurringDonationId(
    recurring_donation_id: string,
    current_date: string,
    role: string,
  ): Promise<void> {
    try {
      let schedule;
      const deletionPastDate = new Date(current_date);
      const scheduleRet = await Scheduling.findOne({
        where: {
          recurring_donation_id,
          start_time: deletionPastDate,
        },
      });
      const allRecurringSchedulesToDelete = await Scheduling.findAll({
        where: {
          recurring_donation_id,
        },
      });
      if (scheduleRet == null) {
        throw new Error(
          `scheduling with recurring_donation_id ${recurring_donation_id} with start time ${deletionPastDate} does not exist.`,
        );
      } else {
        schedule = {
          id: String(scheduleRet.id),
          donorId: String(scheduleRet.donor_id),
          categories: scheduleRet.categories,
          size: scheduleRet.size,
          isPickup: scheduleRet.is_pickup,
          pickupLocation: scheduleRet.pickup_location,
          dayPart: scheduleRet.day_part,
          startTime: scheduleRet.start_time,
          endTime: scheduleRet.end_time,
          status: scheduleRet.status,
          volunteerNeeded: scheduleRet.volunteer_needed,
          volunteerTime: scheduleRet.volunteer_time,
          frequency: scheduleRet.frequency,
          recurringDonationId: String(scheduleRet.recurring_donation_id),
          recurringDonationEndDate: scheduleRet.recurring_donation_end_date,
          notes: scheduleRet.notes,
        };
      }
      const numsDestroyed = await Scheduling.destroy({
        where: {
          recurring_donation_id,
          start_time: {
            [Op.gte]: deletionPastDate,
          },
        },
      });
      if (numsDestroyed <= 0) {
        throw new Error(
          `scheduling with recurring_donation_id ${recurring_donation_id} was not deleted.`,
        );
      }
      if (role === "Admin") {
        this.sendSchedulingCancellationEmail(schedule, true, true);
      } else {
        this.sendSchedulingCancellationEmail(schedule, true, false);
      }
      allRecurringSchedulesToDelete.forEach((s) => {
        schedule = {
          id: String(s.id),
          donorId: String(s.donor_id),
          categories: s.categories,
          size: s.size,
          isPickup: s.is_pickup,
          pickupLocation: s.pickup_location,
          dayPart: s.day_part,
          startTime: s.start_time,
          endTime: s.end_time,
          status: s.status,
          volunteerNeeded: s.volunteer_needed,
          volunteerTime: s.volunteer_time,
          frequency: s.frequency,
          recurringDonationId: String(s.recurring_donation_id),
          recurringDonationEndDate: s.recurring_donation_end_date,
          notes: s.notes,
        };
        if (s.volunteer_id)
          this.sendVolunteerFoodRescueCancellationEmail(
            String(s.volunteer_id),
            schedule,
          );
      });
    } catch (error) {
      Logger.error(
        `Failed to delete scheduling. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    // Update recurring donation end date
    try {
      const recurringDonationEndDate = await Scheduling.max("start_time", {
        where: { recurring_donation_id },
      });
      await Scheduling.update(
        {
          recurring_donation_end_date: recurringDonationEndDate,
        },
        {
          where: { recurring_donation_id },
        },
      );
    } catch (error) {
      Logger.error(
        `Failed to update recurring donation end date. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  async getSchedulingsByVolunteerId(
    volunteerId: string,
  ): Promise<Array<SchedulingDTO>> {
    let schedulingDtos: Array<SchedulingDTO> = [];
    let schedulings: Array<Scheduling>;
    try {
      schedulings = await Scheduling.findAll({
        where: {
          volunteer_id: Number(volunteerId),
          volunteer_needed: true,
          start_time: {
            [Op.gte]: new Date(),
          },
        },
        order: [["start_time", "ASC"]],
      });

      schedulingDtos = schedulings.map((scheduling) => {
        return {
          id: String(scheduling.id),
          donorId: String(scheduling.donor_id),
          categories: scheduling.categories,
          size: scheduling.size,
          isPickup: scheduling.is_pickup,
          pickupLocation: scheduling.pickup_location,
          dayPart: scheduling.day_part,
          startTime: scheduling.start_time,
          endTime: scheduling.end_time,
          status: scheduling.status,
          volunteerNeeded: scheduling.volunteer_needed,
          volunteerTime: scheduling.volunteer_time,
          frequency: scheduling.frequency,
          recurringDonationId: String(scheduling.recurring_donation_id),
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
          volunteerId: String(scheduling.volunteer_id),
        };
      });
    } catch (error) {
      Logger.error(
        `Failed to get schedules by volunteer ID. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }

    return schedulingDtos;
  }

  // send email to admin and volunteer when volunteer has cancelled their own shift
  async sendVolunteerShiftCancellationEmail(
    volunteerId: string,
    scheduling: SchedulingDTO,
    isAdmin: boolean,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendVolunteerShiftCancellationEmail but this instance of SchedulingService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const volunteerService: IVolunteerService = new VolunteerService();
      const {
        firstName,
        lastName,
        email,
      } = await volunteerService.getVolunteerById(volunteerId);
      const donor = await this.donorService.getDonorById(scheduling.donorId);
      dayjs.extend(customParseFormat);
      const startDayString: string = dayjs
        .tz(scheduling.startTime)
        .format("dddd, MMMM D");
      const volunteerStartTime: string = dayjs(
        scheduling.volunteerTime,
        "HH:mm",
      ).format("h:mm A");
      const emailBody = `<html>
        ${emailHeader}
        <body>
        ${
          isAdmin
            ? `
      <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">${firstName} ${lastName} has cancelled their Food Rescue volunteer shift scheduled for
      ${startDayString} at ${volunteerStartTime} with ${donor.businessName}</h2>`
            : `<h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717">Hi ${firstName},</h2>
            <p>You have successfully cancelled your Food Rescue volunteer shift scheduled for ${startDayString} at ${volunteerStartTime} with ${donor.businessName}<br /><br />`
        }
        ${
          !isAdmin
            ? ` <p>
          We hope to see you back at the fridge soon! <br/>
          If this cancellation was made in error, please reschedule or contact the CFKW admin team. 
         </p>
        ${emailFooter}`
            : ""
        }
        </body>
      </html>
        `;
      this.emailService.sendEmail(
        isAdmin ? getAdminEmail() : email,
        isAdmin
          ? `Cancellation Notice: Food Rescue Shift for ${startDayString} at ${volunteerStartTime}`
          : `Confirmation: Cancelled Food Rescue Shift for ${startDayString} at ${volunteerStartTime}`,
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email to notify volunteer cancellation for food rescue shift for volunteer with id ${volunteerId}`,
      );
      throw error;
    }
  }

  // send email to volunteer when admin/donor has cancelled food rescue
  async sendVolunteerFoodRescueCancellationEmail(
    volunteerId: string,
    scheduling: SchedulingDTO,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendVolunteerFoodRescueCancellationEmail but this instance of SchedulingService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const volunteerService: IVolunteerService = new VolunteerService();
      const { firstName, email } = await volunteerService.getVolunteerById(
        volunteerId,
      );
      dayjs.extend(customParseFormat);
      const startDayString: string = dayjs
        .tz(scheduling.startTime)
        .format("dddd, MMMM D");
      const volunteerStartTime: string = dayjs(
        scheduling.volunteerTime,
        "HH:mm",
      ).format("h:mm A");
      const volunteerMainLine = `Your scheduled shift for ${startDayString} at ${volunteerStartTime} has been cancelled.`;
      this.emailService.sendEmail(
        email,
        `Cancellation Notice: Food Rescue Shift for ${startDayString} at ${volunteerStartTime}`,
        cancellationEmail(volunteerMainLine, firstName, true),
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email to notify volunteer cancellation for food rescue shift for volunteer with id ${volunteerId}`,
      );
      throw error;
    }
  }
}

export default SchedulingService;
