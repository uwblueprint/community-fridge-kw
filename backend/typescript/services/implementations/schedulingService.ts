import { snakeCase } from "lodash";
import ISchedulingService from "../interfaces/schedulingService";
import {
  SchedulingDTO,
  CreateSchedulingDTO,
  UpdateSchedulingDTO,
  Frequency,
} from "../../types";
import logger from "../../utilities/logger";
import Scheduling from "../../models/scheduling.model";
import getErrorMessage from "../../utilities/errorMessageUtil";

const Logger = logger(__filename);

class SchedulingService implements ISchedulingService {
  /* eslint-disable class-methods-use-this */

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
  ): Promise<Array<SchedulingDTO>> {
    let schedulingDtos: Array<SchedulingDTO> = [];
    try {
      const schedulings: Array<Scheduling> = await Scheduling.findAll({
        where: { donor_id: Number(donorId) },
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
        `Failed to get schedules. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return schedulingDtos;
  }

  async getSchedulings(): Promise<Array<SchedulingDTO>> {
    let schedulingDtos: Array<SchedulingDTO> = [];
    try {
      const schedulings: Array<Scheduling> = await Scheduling.findAll();
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

  async createScheduling(
    scheduling: CreateSchedulingDTO,
  ): Promise<SchedulingDTO> {
    let newScheduling: Scheduling;
    try {
      const schedulingFrequency = scheduling.frequency;
      if ( schedulingFrequency == Frequency.ONE_TIME ) {
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
      }
      else {
        // get new recurring donation id
        const dbCurrentSchedules : SchedulingDTO[]= await this.getSchedulings();
        const recurringDonationIds = dbCurrentSchedules.map(
          item => {
            return item.recurringDonationId;
          }
        );

        let arrayRecurringDonationIds = [];
        for(let i = 0; i < recurringDonationIds.length; i++){
          if (!recurringDonationIds[i]) {
            arrayRecurringDonationIds.push(0);
          }
          else {
            arrayRecurringDonationIds.push(Number(recurringDonationIds[i]));
          }
        }
        let newRecurringDonationId = Math.max(... arrayRecurringDonationIds) + 1;

        // end date of recurring donation
        let recurringDonationEndDate : Date = scheduling.recurringDonationEndDate!;
        recurringDonationEndDate.setHours(23);
        recurringDonationEndDate.setMinutes(59);
        recurringDonationEndDate.setSeconds(59);
        recurringDonationEndDate.setMilliseconds(999);
        
        //loop for calculations if frequency is DAILY
        if (schedulingFrequency == Frequency.DAILY) {
          const nextDay : Date = scheduling.startTime;
          do {
            const originalStartTime : Date = scheduling.startTime;
            const originalEndTime : Date = scheduling.endTime;
            const newStartTime : Date = new Date(
              nextDay.getFullYear(), 
              nextDay.getMonth(), 
              nextDay.getDay(), 
              originalStartTime.getHours(), 
              originalStartTime.getMinutes(), 
              originalStartTime.getSeconds(), 
              originalStartTime.getMilliseconds()
            );
            const newEndTime : Date = new Date(
              nextDay.getFullYear(), 
              nextDay.getMonth(), 
              nextDay.getDay(),
              originalEndTime.getHours(), 
              originalEndTime.getMinutes(), 
              originalEndTime.getSeconds(), 
              originalEndTime.getMilliseconds()
            );
            //create scheduling
            newScheduling = await Scheduling.create({
              donor_id: scheduling.donorId,
              categories: scheduling.categories,
              size: scheduling.size,
              is_pickup: scheduling.isPickup,
              pickup_location: scheduling.pickupLocation,
              day_part: scheduling.dayPart,
              start_time: newStartTime,
              end_time: newEndTime,
              status: scheduling.status,
              volunteer_needed: scheduling.volunteerNeeded,
              volunteer_time: scheduling.volunteerTime,
              frequency: scheduling.frequency,
              recurring_donation_id: newRecurringDonationId,
              recurring_donation_end_date: scheduling.recurringDonationEndDate,
              notes: scheduling.notes,
            });
            nextDay.setDate(nextDay.getDate() + 1);
          } while (Number(nextDay) <= Number(recurringDonationEndDate));
        }
        //loop for calculations if frequency is WEEKLY
        else if (schedulingFrequency == Frequency.WEEKLY) {
          const nextDay : Date = scheduling.startTime;
          do {
            const originalStartTime : Date = scheduling.startTime;
            const originalEndTime : Date = scheduling.endTime;
            const newStartTime : Date = new Date(
              nextDay.getFullYear(), 
              nextDay.getMonth(), 
              nextDay.getDay(), 
              originalStartTime.getHours(), 
              originalStartTime.getMinutes(), 
              originalStartTime.getSeconds(), 
              originalStartTime.getMilliseconds()
            );
            const newEndTime : Date = new Date(
              nextDay.getFullYear(), 
              nextDay.getMonth(), 
              nextDay.getDay(),
              originalEndTime.getHours(), 
              originalEndTime.getMinutes(), 
              originalEndTime.getSeconds(), 
              originalEndTime.getMilliseconds()
            );
            //create scheduling
            newScheduling = await Scheduling.create({
              donor_id: scheduling.donorId,
              categories: scheduling.categories,
              size: scheduling.size,
              is_pickup: scheduling.isPickup,
              pickup_location: scheduling.pickupLocation,
              day_part: scheduling.dayPart,
              start_time: newStartTime,
              end_time: newEndTime,
              status: scheduling.status,
              volunteer_needed: scheduling.volunteerNeeded,
              volunteer_time: scheduling.volunteerTime,
              frequency: scheduling.frequency,
              recurring_donation_id: newRecurringDonationId,
              recurring_donation_end_date: scheduling.recurringDonationEndDate,
              notes: scheduling.notes,
            });
            nextDay.setDate(nextDay.getDate() + 7);
          } while (Number(nextDay) <= Number(recurringDonationEndDate));
        }
        //loop for calculations if frequency is MONTHLY
        else {
          const nextDay : Date = scheduling.startTime;
          do {
            const originalStartTime : Date = scheduling.startTime;
            const originalEndTime : Date = scheduling.endTime;
            const newStartTime : Date = new Date(
              nextDay.getFullYear(), 
              nextDay.getMonth(), 
              nextDay.getDay(), 
              originalStartTime.getHours(), 
              originalStartTime.getMinutes(), 
              originalStartTime.getSeconds(), 
              originalStartTime.getMilliseconds()
            );
            const newEndTime : Date = new Date(
              nextDay.getFullYear(), 
              nextDay.getMonth(), 
              nextDay.getDay(),
              originalEndTime.getHours(), 
              originalEndTime.getMinutes(), 
              originalEndTime.getSeconds(), 
              originalEndTime.getMilliseconds()
            );
            //create scheduling
            newScheduling = await Scheduling.create({
              donor_id: scheduling.donorId,
              categories: scheduling.categories,
              size: scheduling.size,
              is_pickup: scheduling.isPickup,
              pickup_location: scheduling.pickupLocation,
              day_part: scheduling.dayPart,
              start_time: newStartTime,
              end_time: newEndTime,
              status: scheduling.status,
              volunteer_needed: scheduling.volunteerNeeded,
              volunteer_time: scheduling.volunteerTime,
              frequency: scheduling.frequency,
              recurring_donation_id: newRecurringDonationId,
              recurring_donation_end_date: scheduling.recurringDonationEndDate,
              notes: scheduling.notes,
            });
            nextDay.setMonth(nextDay.getMonth() + 1);
          } while (Number(nextDay) <= Number(recurringDonationEndDate));
        }
      }
    } catch (error) {
      Logger.error(
        `Failed to create scheduling. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
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
}

export default SchedulingService;
