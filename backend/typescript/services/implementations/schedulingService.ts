import { snakeCase } from "lodash";
import ISchedulingService from "../interfaces/schedulingService";
import {
  SchedulingDTO,
  CreateSchedulingDTO,
  UpdateSchedulingDTO,
} from "../../types";
import logger from "../../utilities/logger";
import Scheduling from "../../models/scheduling.model";

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
      Logger.error(`Failed to get user. Reason = ${error.message}`);
      throw error;
    }

    // TODO: retrieve volunteer ids from scheduling-volunteer
    // table and add to returned object once volunteer table is created
    const volunteerIds: number[] = [];

    return {
      id: String(scheduling.id),
      donorId: String(scheduling.donor_id),
      category: scheduling.category,
      quantity: scheduling.quantity,
      size: scheduling.size,
      pickupLocation: scheduling.pickup_location,
      startTime: scheduling.start_time,
      endTime: scheduling.end_time,
      status: scheduling.status,
      volunteersNeeded: scheduling.volunteers_needed,
      volunteerIds,
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
          category: scheduling.category,
          quantity: scheduling.quantity,
          size: scheduling.size,
          pickupLocation: scheduling.pickup_location,
          startTime: scheduling.start_time,
          endTime: scheduling.end_time,
          status: scheduling.status,
          volunteersNeeded: scheduling.volunteers_needed,
          volunteerIds: [],
          notes: scheduling.notes,
        };
      });
    } catch (error) {
      Logger.error(`Failed to get schedules. Reason = ${error.message}`);
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
          category: scheduling.category,
          quantity: scheduling.quantity,
          size: scheduling.size,
          pickupLocation: scheduling.pickup_location,
          startTime: scheduling.start_time,
          endTime: scheduling.end_time,
          status: scheduling.status,
          volunteersNeeded: scheduling.volunteers_needed,
          volunteerIds: [],
          notes: scheduling.notes,
        };
      });
    } catch (error) {
      Logger.error(`Failed to get schedulings. Reason = ${error.message}`);
      throw error;
    }

    return schedulingDtos;
  }

  async createScheduling(
    scheduling: CreateSchedulingDTO,
  ): Promise<SchedulingDTO> {
    let newScheduling: Scheduling;
    try {
      newScheduling = await Scheduling.create({
        donor_id: scheduling.donorId,
        category: scheduling.category,
        quantity: scheduling.quantity,
        size: scheduling.size,
        pickup_location: scheduling.pickupLocation,
        start_time: scheduling.startTime,
        end_time: scheduling.endTime,
        status: scheduling.status,
        volunteers_needed: scheduling.volunteersNeeded,
        notes: scheduling.notes,
      });
    } catch (error) {
      Logger.error(`Failed to create scheduling. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: String(newScheduling.id),
      donorId: String(newScheduling.donor_id),
      category: newScheduling.category,
      quantity: newScheduling.quantity,
      size: newScheduling.size,
      pickupLocation: newScheduling.pickup_location,
      startTime: newScheduling.start_time,
      endTime: newScheduling.end_time,
      status: newScheduling.status,
      volunteersNeeded: newScheduling.volunteers_needed,
      volunteerIds: [],
      notes: newScheduling.notes,
    };
  }

  // TODO: handle case when times are updated (change status to pending?)
  async updateSchedulingById(
    schedulingId: string,
    scheduling: UpdateSchedulingDTO,
  ): Promise<SchedulingDTO> {
    try {
      const updatesSnakeCase: Record<string, any> = {};
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
        category: updatedScheduling.category,
        quantity: updatedScheduling.quantity,
        size: updatedScheduling.size,
        pickupLocation: updatedScheduling.pickup_location,
        startTime: updatedScheduling.start_time,
        endTime: updatedScheduling.end_time,
        status: updatedScheduling.status,
        volunteersNeeded: updatedScheduling.volunteers_needed,
        volunteerIds: [],
        notes: updatedScheduling.notes,
      };
    } catch (error) {
      Logger.error(`Failed to update scheduling. Reason = ${error.message}`);
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
      Logger.error(`Failed to delete scheduling. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default SchedulingService;
