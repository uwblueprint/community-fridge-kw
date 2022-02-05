/* eslint-disable class-methods-use-this */
import { snakeCase } from "lodash";
import { Op } from "sequelize";
import dayjs from "dayjs";
import ordinal from "ordinal";
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

function cancellationEmail(mainLine: string, name: string) {
  return `
  <html >
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
     <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717;">Hey there ${name}!</h2>
     <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">${mainLine}
 </p>
 
 <table cellspacing="0" cellpadding="0"> <tr> 
      <td align="center" width="255" height="44" bgcolor="#C31887" style="-webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; color: #ffffff; display: block;">
        <a href="google.com" style="font-size:14px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
        <span style="color: #FAFCFE;">
          View Dashboard
        </span>
        </a>
      </td> 
      </tr> </table> 
        <p style="color:#6C6C84"> <b>Have a question?</b> <br/>
          Contact Community Fridge KW at <a href="mailto: communityfridgekw@gmail.com">communityfridgekw@gmail.com </a>
        </p>
        <br/>
 <p style="margin-top: 50px; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Sincerely,</p>
 <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Community Fridge KW</p>   
 </body>
 </html>
  `;
}

class SchedulingService implements ISchedulingService {
  emailService: IEmailService | null;

  donorService: IDonorService;

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

    // TODO: retrieve volunteer ids from scheduling-volunteer
    // table and add to returned object once volunteer table is created
    const volunteerIds: number[] = [];

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
      volunteerIds,
      frequency: scheduling.frequency,
      recurringDonationId: String(scheduling.recurring_donation_id),
      recurringDonationEndDate: scheduling.recurring_donation_end_date,
      notes: scheduling.notes,
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
          volunteerIds: [],
          frequency: scheduling.frequency,
          recurringDonationId: String(scheduling.recurring_donation_id),
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
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
          volunteerIds: [],
          frequency: scheduling.frequency,
          recurringDonationId: String(scheduling.recurring_donation_id),
          recurringDonationEndDate: scheduling.recurring_donation_end_date,
          notes: scheduling.notes,
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

  async sendEmailVerificationAfterSchedulingADonation(
    donor: UserDonorDTO,
    schedule: SchedulingDTO,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendEmailVerificationAfterSchedulingADonation but this instance of SchedulingService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const { firstName } = donor;

      // Proposed drop off info
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

      const emailBody = `
      <html >
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
         <h2 style="font-weight: 700; font-size: 16px; line-height: 22px; color: #171717;">Hey there ${firstName}!</h2>
         <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Thank you for scheduling a donation to your local community fridge.
         <br />
         <br />
         Here is a summary of your upcoming donation:
     </p>
     
     <div style="display: flex; flex-direction: row; align-content: flex-start; gap: 20px;">
         <div>
             <h2 style="font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">
                 Proposed drop-off time
             </h2>
             <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
                 ${startDayString}
                 <br />
                 ${startTimeString} - ${endTimeString}
                 <br />
                 ${frequencyString}
             </p>
         </div>
         <div>
            <h2 style="font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">
             Donation information
         </h2>
         <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
             ${schedule.size} - ${donationSizeDescriptions.get(
        schedule.size ?? "",
      )}
             <br/>
             ${schedule.categories.join(", ")}
         </p>
     
     
     </div>
     </div>
     
     
     <h2 style="font-weight: 600; font-size: 18px; line-height: 28px; color: #171717;">
         Volunteer information
     </h2>
     <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">
         ${schedule.volunteerNeeded ? "Volunteer required" : ""}
     <br/>
     ${schedule.isPickup ? "Pickup required" : ""}
     <br/>
     ${schedule.isPickup ? schedule.pickupLocation : ""}
     <br/>
     ${schedule.notes ? `Additional Notes: ${schedule.notes}` : ""}
     </p>
     
     
     <p style="margin-top: 50px; font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Sincerely,</p>
     <p style="font-weight: 400; font-size: 16px; line-height: 24px; color: #171717;">Community Fridge KW</p>   
     </body>
     </html>
      `;

      this.emailService.sendEmail(
        donor.email,
        "Your Donation Information",
        emailBody,
      );
    } catch (error) {
      Logger.error(
        `Failed to generate email to confirm donation details of donation scheduled by ${donor.email}`,
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
        });
      } else {
        // get new recurring donation id
        const newRecurringDonationId =
          Number(await Scheduling.max("recurring_donation_id")) + 1;

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
    // send email
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
      volunteerIds: [],
      frequency: newScheduling.frequency,
      recurringDonationId: String(newScheduling.recurring_donation_id),
      recurringDonationEndDate: newScheduling.recurring_donation_end_date,
      notes: newScheduling.notes,
    };
    const currDonor: UserDonorDTO = await this.donorService.getDonorById(
      scheduling.donorId,
    );
    this.sendEmailVerificationAfterSchedulingADonation(
      currDonor,
      retNewSchedule,
    );

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
      const updateResult = await Scheduling.update(updatesSnakeCase, {
        where: { id: Number(schedulingId) },
        returning: true,
      });
      if (updateResult[0] < 1) {
        throw new Error(`schedulingId ${schedulingId} not found.`);
      }
      const updatedScheduling = updateResult[1][0];
      return {
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
        volunteerIds: [],
        frequency: updatedScheduling.frequency,
        recurringDonationId: String(updatedScheduling.recurring_donation_id),
        recurringDonationEndDate: updatedScheduling.recurring_donation_end_date,
        notes: updatedScheduling.notes,
      };
    } catch (error) {
      Logger.error(
        `Failed to update scheduling. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async sendEmailAfterSchedulingCancellation(
    donor: UserDonorDTO,
    schedule: SchedulingDTO,
    isRecurringDonation: number,
    isAdminDeleted: number,
  ): Promise<void> {
    if (!this.emailService) {
      const errorMessage =
        "Attempted to call sendEmailAfterSchedulingCancellation but this instance of SchedulingService does not have an EmailService instance";
      Logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      const { startTime } = schedule;
      const startTimeToLocalDate = startTime.toLocaleString("en-US", {
        timeZone: "EST",
      });

      const startDayString: string = dayjs(startTimeToLocalDate).format(
        "dddd, MMMM D",
      );

      const startTimeString: string = dayjs(startTimeToLocalDate).format(
        "h:mm A",
      );

      // if admin deleted on behalf of donor
      if (isAdminDeleted) {
        const donorMainLine = `Your donation scheduled for ${startDayString} at ${startTimeString}${
          isRecurringDonation ? " and all following donations" : ""
        } has been cancelled by Community Fridge KW admin.`;
        const adminMainLine = `The scheduled donation by ${
          donor.businessName
        } for ${startDayString} at ${startTimeString}${
          isRecurringDonation ? " and all following donations " : ""
        } has been cancelled.`;

        this.emailService.sendEmail(
          donor.email,
          "Donation Cancelled By Community Fridge KW Admin",
          cancellationEmail(donorMainLine, donor.firstName),
        );
        this.emailService.sendEmail(
          "luol.linna@gmail.com",
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
          isRecurringDonation ? " and all following donations " : ""
        }!`;

        this.emailService.sendEmail(
          donor.email,
          "Donation Cancellation Confirmation",
          cancellationEmail(donorMainLine, donor.firstName),
        );
        this.emailService.sendEmail(
          "luol.linna@gmail.com",
          `${donor.businessName} Donation Cancellation`,
          cancellationEmail(adminMainLine, "Community Fridge KW"),
        );
      }
    } catch (error) {
      Logger.error(
        `Failed to generate email to confirm donation cancellation of donation scheduled by ${donor.email}`,
      );
      throw error;
    }
  }

  async deleteSchedulingById(id: string): Promise<void> {
    try {
      const schedule = await this.getSchedulingById(id);
      const numDestroyed = await Scheduling.destroy({
        where: { id: Number(id) },
      });
      if (numDestroyed <= 0) {
        throw new Error(`scheduling with id ${id} was not deleted.`);
      }
      this.sendEmailAfterSchedulingCancellation(
        await this.donorService.getDonorById(schedule.donorId),
        schedule,
        0,
        0,
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
  }
}

export default SchedulingService;
