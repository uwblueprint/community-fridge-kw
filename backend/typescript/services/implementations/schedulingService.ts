/* eslint-disable class-methods-use-this */
import { snakeCase } from "lodash";
import { Op } from "sequelize";
import dayjs from "dayjs";
import ordinal from "ordinal";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ISchedulingService from "../interfaces/schedulingService";
import IEmailService from "../interfaces/emailService";
import IDonorService from "../interfaces/donorService";
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

const Logger = logger(__filename);

function toSnakeCase(
  schedule: CreateSchedulingDTO,
): Record<string, string | string[] | boolean | number | Date | undefined> {
  const scheduleSnakeCase: Record<
    string,
    string | string[] | boolean | number | Date | undefined
  > = {};
  Object.entries(schedule).forEach(([key, value]) => {
    scheduleSnakeCase[snakeCase(key)] = value;
  });
  return scheduleSnakeCase;
}

class SchedulingService implements ISchedulingService {
  emailService: IEmailService | null;

  donorService: IDonorService;

  static TEMP_ADMIN_EMAIL = "jessiepeng@uwblueprint.org";

  constructor(
    emailService: IEmailService | null = null,
    donorService: IDonorService,
  ) {
    this.emailService = emailService;
    this.donorService = donorService;
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
      recurringDonationId: String(scheduling.recurring_donation_id),
      recurringDonationEndDate: scheduling.recurring_donation_end_date,
      notes: scheduling.notes,
      volunteerId: scheduling.volunteer_id,
    };
  }

  async getSchedulingsByDonorId(
    donorId: string,
    weekLimit: number,
  ): Promise<Array<SchedulingDTO>> {
    let schedulingDtos: Array<SchedulingDTO> = [];
    let schedulings: Array<Scheduling>;
    try {
      if (weekLimit !== 0) {
        const currentStartDate = new Date();
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
          recurringDonationId: String(scheduling.recurring_donation_id),
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
          volunteerId: scheduling.volunteer_id ?? undefined,
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
          recurringDonationId: String(scheduling.recurring_donation_id),
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
          volunteerId: scheduling.volunteer_id,
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

      const startTimeToLocalDate = startTime.toLocaleString("en-US", {
        timeZone: "EST",
      });

      const startDayString: string = dayjs(startTimeToLocalDate).format(
        "dddd, MMMM D",
      );

      const startTimeString: string = dayjs(startTimeToLocalDate).format(
        "h:mm A",
      );
      const endTimeString: string = dayjs(
        endTime.toLocaleString("en-US", {
          timeZone: "EST",
        }),
      ).format("h:mm A");

      // frequency string
      // e.g. Weekly on <day of week> until <recurringDonationEndDate>
      let frequencyString = "One-time donation";
      if (schedule.frequency !== Frequency.ONE_TIME) {
        if (schedule.frequency === Frequency.DAILY) {
          frequencyString = `Daily`;
        } else if (schedule.frequency === Frequency.WEEKLY) {
          frequencyString = `Weekly on ${dayjs(startTimeToLocalDate).format(
            "dddd",
          )}`;
        } else {
          frequencyString = `Monthly on the ${ordinal(
            Number(dayjs(startTimeToLocalDate).format("D")),
          )}`;
        }
      }

      dayjs.extend(customParseFormat);

      const volunteerTimeString =
        dayjs(schedule.volunteerTime, "HH:mm").format("h:mm A") ?? "";

      const emailBody = `
        <html>
          <head>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter"
              rel="stylesheet"
            />
            <style>
              body {
                  font-family: "Inter";
              }
            </style>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge" />
            <title>Donation Details Email</title>
          </head>
          <body>
              <p><img src=https://i.ibb.co/txCj8db/drawer-logo.png
              style="width: 134px; margin-bottom: 20px;  alt="CFKW Logo"/></p>
              
              <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
              
              ${
                updated
                  ? `Your community fridge donation has been edited by the admin team.
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
     <p style="margin-top: 50px; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Sincerely,</p>
     <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Community Fridge KW</p>   
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
        isAdmin ? SchedulingService.TEMP_ADMIN_EMAIL : email,
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
          volunteerId: undefined,
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
        const recurringDonationEndDate: Date = new Date(
          scheduling.recurringDonationEndDate!,
        );
        recurringDonationEndDate.setHours(23, 59, 59, 999);

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
        });

        const schedulesToBeCreated: Record<
          string,
          string | number | boolean | string[] | Date | undefined
        >[] = [];

        const originalStartTime: Date = new Date(scheduling.startTime);
        const originalEndTime: Date = new Date(scheduling.endTime);
        // loop for calculations if frequency is DAILY
        if (schedulingFrequency === Frequency.DAILY) {
          const nextDay: Date = new Date(scheduling.startTime);
          nextDay.setDate(nextDay.getDate() + 1);

          while (nextDay.valueOf() <= recurringDonationEndDate.valueOf()) {
            const newStartTime: Date = new Date(nextDay);

            newStartTime.setHours(originalStartTime.getHours());
            newStartTime.setMinutes(originalStartTime.getMinutes());
            newStartTime.setSeconds(originalStartTime.getSeconds());
            newStartTime.setSeconds(originalStartTime.getMilliseconds());

            const newEndTime: Date = new Date(nextDay);
            newEndTime.setHours(originalEndTime.getHours());
            newEndTime.setMinutes(originalEndTime.getMinutes());
            newEndTime.setSeconds(originalEndTime.getSeconds());
            newEndTime.setSeconds(originalEndTime.getMilliseconds());

            const newSchedule: CreateSchedulingDTO = {
              ...scheduling,
              startTime: newStartTime,
              endTime: newEndTime,
              recurringDonationId: String(newRecurringDonationId),
            };
            const snakeCaseNewSchedule: Record<
              string,
              string | string[] | boolean | number | Date | undefined
            > = toSnakeCase(newSchedule);

            schedulesToBeCreated.push(snakeCaseNewSchedule);
            nextDay.setDate(nextDay.getDate() + 1);
          }
          await Scheduling.bulkCreate(schedulesToBeCreated);
        }
        // loop for calculations if frequency is WEEKLY
        else if (schedulingFrequency === Frequency.WEEKLY) {
          const nextDay: Date = new Date(scheduling.startTime);
          nextDay.setDate(nextDay.getDate() + 7);

          while (nextDay.valueOf() <= recurringDonationEndDate.valueOf()) {
            const newStartTime: Date = new Date(nextDay);

            newStartTime.setHours(originalStartTime.getHours());
            newStartTime.setMinutes(originalStartTime.getMinutes());
            newStartTime.setSeconds(originalStartTime.getSeconds());
            newStartTime.setSeconds(originalStartTime.getMilliseconds());

            const newEndTime: Date = new Date(nextDay);
            newEndTime.setHours(originalEndTime.getHours());
            newEndTime.setMinutes(originalEndTime.getMinutes());
            newEndTime.setSeconds(originalEndTime.getSeconds());
            newEndTime.setSeconds(originalEndTime.getMilliseconds());

            const newSchedule: CreateSchedulingDTO = {
              ...scheduling,
              startTime: newStartTime,
              endTime: newEndTime,
              recurringDonationId: String(newRecurringDonationId),
            };
            const snakeCaseNewSchedule: Record<
              string,
              string | string[] | boolean | number | Date | undefined
            > = toSnakeCase(newSchedule);

            schedulesToBeCreated.push(snakeCaseNewSchedule);
            nextDay.setDate(nextDay.getDate() + 7);
          }
          await Scheduling.bulkCreate(schedulesToBeCreated);
        }
        // loop for calculations if frequency is MONTHLY
        else {
          const nextDay: Date = new Date(scheduling.startTime);
          nextDay.setDate(nextDay.getDate() + 28);

          while (nextDay.valueOf() <= recurringDonationEndDate.valueOf()) {
            const newStartTime: Date = new Date(nextDay);

            newStartTime.setHours(originalStartTime.getHours());
            newStartTime.setMinutes(originalStartTime.getMinutes());
            newStartTime.setSeconds(originalStartTime.getSeconds());
            newStartTime.setSeconds(originalStartTime.getMilliseconds());

            const newEndTime: Date = new Date(nextDay);
            newEndTime.setHours(originalEndTime.getHours());
            newEndTime.setMinutes(originalEndTime.getMinutes());
            newEndTime.setSeconds(originalEndTime.getSeconds());
            newEndTime.setSeconds(originalEndTime.getMilliseconds());

            const newSchedule: CreateSchedulingDTO = {
              ...scheduling,
              startTime: newStartTime,
              endTime: newEndTime,
              recurringDonationId: String(newRecurringDonationId),
            };
            const snakeCaseNewSchedule: Record<
              string,
              string | string[] | boolean | number | Date | undefined
            > = toSnakeCase(newSchedule);

            schedulesToBeCreated.push(snakeCaseNewSchedule);
            nextDay.setDate(nextDay.getDate() + 28);
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
        if (key !== "recurringDonationId") {
          updatesSnakeCase[snakeCase(key)] = value;
        }
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
        volunteerId: updatedScheduling.volunteer_id,
      };

      this.sendScheduledDonationEmail(true, updatedSchedulingDTO, false);

      return updatedSchedulingDTO;
    } catch (error) {
      Logger.error(
        `Failed to update scheduling. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteSchedulingById(id: string): Promise<void> {
    try {
      const numDestroyed = await Scheduling.destroy({
        where: { id: Number(id) },
      });
      if (numDestroyed <= 0) {
        throw new Error(`scheduling with id ${id} was not deleted.`);
      }
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
  ): Promise<void> {
    try {
      const deletionPastDate = new Date(current_date);
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
}

export default SchedulingService;
