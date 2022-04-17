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
   * @param weekLimit returns schedules for the specified upcoming weeks, 0 indicates no weeklimit
   * @returns array of SchedulingDTOs
   * @throws Error if schedule retrieval fails
   */
  getSchedulingsByDonorId(
    donorId: string,
    weekLimit: number,
  ): Promise<Array<SchedulingDTO>>;

  /**
   * Get all scheduling information associated with volunteerId
   * @param volunteerId id associated with volunteer
   * @returns array of SchedulingDTOs
   * @throws Error if schedule retrieval fails
   */
  getSchedulingsByVolunteerId(
    volunteerId: string,
  ): Promise<Array<SchedulingDTO>>;

  /**
   * Get all scheduling information where volunteer is needed and no volunteer has been assigned
   * @param isVolunteerSlotFilled? filters if returned schedules have  volunteer slot filled or not
   * @returns array of SchedulingDTOs
   * @throws Error if scheduling retrieval fails
   */
  getSchedulingsByVolunteersNeeded(
    isVolunteerSlotFilled?: boolean,
  ): Promise<Array<SchedulingDTO>>;

  /**
   * Get all scheduling information (possibly paginated in the future)
   * @returns array of SchedulingDTOs
   * @throws Error if scheduling retrieval fails
   */
  getSchedulings(): Promise<Array<SchedulingDTO>>;

  /**
   * Get all scheduling information where it is either pickup or onsite
   * @param isPickUp filters if schedules requiring volunteers require pickup or not
   * @returns array of SchedulingDTOs
   * @throws Error if scheduling retrieval fails
   */
  getSchedulingsByPickUp(isPickUp: boolean): Promise<Array<SchedulingDTO>>;

  /**
   * Generate an email with donation information to be sent after user schedules
   * a donation
   * @param updated if email is regarding an update made to the schedule
   * @param schedule object that contains information on scheduled donation
   * @param isAdmin if email is directed to admin
   * @throws Error if unable to send email
   */
  sendScheduledDonationEmail(
    updated: boolean,
    schedule: SchedulingDTO,
    isAdmin: boolean,
  ): Promise<void>;

  /**
   * Generate an email with donation information to be sent after user schedules
   * a donation
   * @param schedule object that contains information on cancelled donation
   * @param isRecurringDonation false if the cancelled donation is a one-time donation, true otherwise
   * @param isAdminDeleted false if donor that scheduled donation is cancelling donation, true otherwise
   * @throws Error if unable to send email
   */
  sendSchedulingCancellationEmail(
    schedule: SchedulingDTO,
    isRecurringDonation: boolean,
    isAdminDeleted: boolean,
  ): Promise<void>;

  /**
   * Generate a confirmation email with food rescue donation information for volunteer who signed up for the shift
   * @param volunteerId of volunteer who signed up for shift
   * @param scheduling object that contains food rescue donation information
   * @param isAdmin if email is directed to admin
   * @throws Error if unable to send email
   */
  sendVolunteerSchedulingSignUpConfirmationEmail(
    volunteerId: string,
    scheduling: SchedulingDTO,
    isAdmin: boolean,
  ): Promise<void>;

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
   * update schedulings by recurring_donation_id
   * @param recurring_donation_id recurring donation id
   * @throws Error if recurring donation update fails
   */
  updateSchedulingByRecurringDonationId(
    recurring_donation_id: string,
    scheduling: UpdateSchedulingDTO,
  ): Promise<void>;

  /**
   * Delete a scheduling by id
   * @param id scheduling id
   * @param role of user that is deleting the donation
   * @throws Error if scheduling deletion fails
   */
  deleteSchedulingById(id: string, role: string): Promise<void>;

  /**
   * Delete a scheduling by recurring_donation_id
   * @param recurring_donation_id recurring donation id
   * @param current_date the current date of the recurrring donation
   * @param role of user that is deleting the recurring donation
   * @throws Error if recurring donation deletion fails
   */
  deleteSchedulingByRecurringDonationId(
    recurring_donation_id: string,
    current_date: string,
    role: string,
  ): Promise<void>;

  /**
   *
   * Generate a confirmation email when a volunteer cancels a food rescue shift
   * @param volunteerId of volunteer who cancelled the shift
   * @param scheduling object that contains the food rescue information
   * @param isAdmin boolean for if the email is to be sent to an admin or volunteer
   * @throws Error if unable to send email
   */
  sendFoodRescueCancellationEmail(
    volunteerId: string,
    scheduling: SchedulingDTO,
    isAdmin: boolean,
  ): Promise<void>;
}

export default ISchedulingService;
