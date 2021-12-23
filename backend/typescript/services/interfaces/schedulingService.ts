import {
  SchedulingDTO,
  CreateSchedulingDTO,
  UpdateSchedulingDTO,
} from "../../types";

interface ISchedulingService {
  /**
   * Get scheduling information associated with id
   * @param id id of scheduling object
   * @returns a SchedulingDTO
   * @throws Error if scheduling retrieval fails
   */
  getSchedulingById(id: string): Promise<SchedulingDTO>;

  /**
   * Get all scheduling information associated with donorId
   * @param donorId id associated with donor
   * @param weekLimit default none but if provided, returns schedules for the upcoming week
   * @returns array of SchedulingDTOs
   * @throws Error if schedule retrieval fails
   */
  getSchedulingsByDonorId(
    donorId: string,
    weekLimit: number,
  ): Promise<Array<SchedulingDTO>>;

  /**
   * Get all scheduling information (possibly paginated in the future)
   * @returns array of SchedulingDTOs
   * @throws Error if scheduling retrieval fails
   */
  getSchedulings(): Promise<Array<SchedulingDTO>>;

  /**
   * Create scheduling
   * @param scheduling CreateSchedulingDTO object containing scheduling info
   * @returns a SchedulingDTO with the created scheduling information
   * @throws Error if scheduling creation fails
   */
  createScheduling(scheduling: CreateSchedulingDTO): Promise<SchedulingDTO>;

  /**
   * Update scheduling.
   * @param id id of scheduling object
   * @param scheduling UpdateSchedulingDTO object containing scheduling info to be updated
   * @returns a SchedulingDTO with the updated scheduling information
   * @throws Error if scheduling update fails
   */
  updateSchedulingById(
    id: string,
    scheduling: UpdateSchedulingDTO,
  ): Promise<SchedulingDTO>;

  /**
   * Delete a scheduling by id
   * @param id scheduling id
   * @throws Error if scheduling deletion fails
   */
  deleteSchedulingById(id: string): Promise<void>;
}

export default ISchedulingService;
