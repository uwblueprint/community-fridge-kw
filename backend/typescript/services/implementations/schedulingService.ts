import ISchedulingService from "../interfaces/schedulingService";
import { Status, SchedulingDTO, CreateSchedulingDTO, UpdateSchedulingDTO } from "../../types";
import logger from "../../utilities/logger";
import Scheduling from "../../models/scheduling.model";

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
      const schedulings: Array<SchedulingDTO> = await Scheduling.findAll({where: {donorId: donorId}});
      
      schedulingDtos = schedulings.map( scheduling => {
        return {
            id: scheduling.id,
            donorId: scheduling.donorId,
            description: scheduling.description,
            quantity: scheduling.quantity,
            startTime: scheduling.startTime,
            endTime: scheduling.endTime,
            status: scheduling.status,
            volunteersNeeded: scheduling.volunteersNeeded,
            volunteerIds: scheduling.volunteerIds,
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
        start_time: scheduling.startTime,
        end_time: scheduling.endTime,
        status: "Pending",
        volunteersNeeded: scheduling.volunteersNeeded,
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
      startTime: newScheduling.start_time,
      endTime: newScheduling.end_time,
      status: newScheduling.status,
      volunteersNeeded: newScheduling.volunteers_needed,
      volunteerIds: newScheduling.volunteer_ids,
      notes: newScheduling.notes, 
    }
  }

/* TODOs:
 - check for which fields were updated rather than update everything 
 - determine which fields can be updated
 - handle case when times are updated (change status to pending?)
 */
  async updateSchedulingById(schedulingId: number, scheduling: UpdateSchedulingDTO): Promise<SchedulingDTO>{
    try {
        const updateResult = await Scheduling.updateResult(
            {
                description: scheduling.description,
                quantity: scheduling.quantity,
                startTime: scheduling.startTime,
                endTime: scheduling.endTime,
                volunteersNeeded: scheduling.volunteersNeeded,
                notes: scheduling.notes,
            },
            {
                where: { id: schedulingId },
                returning: true,
            }
        );
        /* Linna left off here */
        if ( updateResult[0] < 1 ) {
            throw new Error(`schedulingId ${schedulingId} not found.`);
        }
    } catch (error) {
        
    }
  }

  async deleteSchedulingById(id: number): Promise<void>{

  }
}