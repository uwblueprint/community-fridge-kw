import ISchedulingService from "../interfaces/schedulingService";
import { Status, SchedulingDTO, CreateSchedulingDTO, UpdateSchedulingDTO } from "../../types";
import logger from "../../utilities/logger";
import Scheduling from "../../models/scheduling.model";
import { snakeCase } from "lodash";

const Logger = logger(__filename);

class SchedulingService implements ISchedulingService {
  async getSchedulingById(id: number): Promise<SchedulingDTO> {
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
    let volunteerIds: number[] = [];

    return {
      id: scheduling.id,
      donorId: scheduling.donor_id,
      description: scheduling.description,
      quantity: scheduling.quantity,
      pickupLocation: scheduling.pickup_location,
      startTime: scheduling.start_time,
      endTime: scheduling.end_time,
      status: scheduling.status,
      volunteersNeeded: scheduling.volunteers_needed,
      volunteerIds: volunteerIds,
      notes: scheduling.notes,
    };
  }

  async getSchedulingsByDonorId(donorId: number): Promise<Array<SchedulingDTO>>{
    let schedulingDtos: Array<SchedulingDTO> = [];
    try {
      const schedulings: Array<Scheduling> = await Scheduling.findAll({where: {donorId: donorId}});

      schedulingDtos = schedulings.map(scheduling => {
        return {
            id: scheduling.id,
            donorId: scheduling.donor_id,
            description: scheduling.description,
            quantity: scheduling.quantity,
            pickupLocation: scheduling.pickup_location,
            startTime: scheduling.start_time,
            endTime: scheduling.end_time,
            status: scheduling.status,
            volunteersNeeded: scheduling.volunteers_needed,
            volunteerIds: [],
            notes: scheduling.notes,
        }
      });
    } catch (error) {
        Logger.error(`Failed to get schedules. Reason = ${error.message}`);
        throw error;
    }

    return schedulingDtos;
  }

  async getSchedulings(): Promise<Array<SchedulingDTO>>{
    let schedulingDtos: Array<SchedulingDTO> = [];
    try {
      const schedulings: Array<Scheduling> = await Scheduling.findAll();
      schedulingDtos = schedulings.map(scheduling => {
        return {
          id: scheduling.id,
          donorId: scheduling.donor_id,
          description: scheduling.description,
          quantity: scheduling.quantity,
          pickupLocation: scheduling.pickup_location,
          startTime: scheduling.start_time,
          endTime: scheduling.end_time,
          status: scheduling.status,
          volunteersNeeded: scheduling.volunteers_needed,
          volunteerIds: [],
          notes: scheduling.notes,
        }
      });

    } catch (error) {
      Logger.error(`Failed to get schedulings. Reason = ${error.message}`);
      throw error;
    }

    return schedulingDtos;
  }

  async createScheduling(scheduling: CreateSchedulingDTO): Promise<SchedulingDTO>{
    let newScheduling: Scheduling;
    try {
      newScheduling = await Scheduling.create({
        donor_id: scheduling.donorId,
        description: scheduling.description,
        quantity: scheduling.quantity,
        pickup_location: scheduling.pickupLocation,
        start_time: scheduling.startTime,
        end_time: scheduling.endTime,
        status: "Pending",
        volunteers_needed: scheduling.volunteersNeeded,
        notes: scheduling.notes,
      });
    } catch (error) {
      Logger.error(`Failed to create scheduling. Reason = ${error.message}`);
      throw error
    }

    return {
      id: newScheduling.id,
      donorId: newScheduling.donor_id,
      description: newScheduling.description,
      quantity: newScheduling.quantity,
      pickupLocation: newScheduling.pickup_location,
      startTime: newScheduling.start_time,
      endTime: newScheduling.end_time,
      status: newScheduling.status,
      volunteersNeeded: newScheduling.volunteers_needed,
      volunteerIds: [],
      notes: newScheduling.notes,
    }
  }

/* TODOs:
 - determine which fields can be updated
 - handle case when times are updated (change status to pending?)
 - handle case when UpdateSchedulingDTO only contains fields to update (all others would be set to null?)
 */
  async updateSchedulingById(schedulingId: number, scheduling: UpdateSchedulingDTO): Promise<SchedulingDTO>{
    try {
        const updatesSnakeCase: Record<string, any> = {};
        Object.entries(scheduling).forEach(([key, value]) => {
          updatesSnakeCase[snakeCase(key)] = value;
        })
        const updateResult = await Scheduling.update(
            updatesSnakeCase, {
              where: { id: schedulingId },
              returning: true,
            }
        );
        if ( updateResult[0] < 1 ) {
            throw new Error(`schedulingId ${schedulingId} not found.`);
        }
        const updatedScheduling = updateResult[1][0]
        return {
          id: updatedScheduling.id,
          donorId: updatedScheduling.donor_id,
          description: updatedScheduling.description,
          quantity: updatedScheduling.quantity,
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

  async deleteSchedulingById(id: number): Promise<void>{
    try {
      const numDestroyed = await Scheduling.destroy({
        where: { id: id },
      });
      if (numDestroyed <= 0) {
        throw new Error(
          `scheduling with id ${id} was not deleted.`,
        );
      }
    } catch (error) {
      Logger.error(`Failed to delete scheduling. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default SchedulingService;
