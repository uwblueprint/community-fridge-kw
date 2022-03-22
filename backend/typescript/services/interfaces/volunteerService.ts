import {
  VolunteerDTO,
  UserVolunteerDTO,
  UpdateVolunteerDTO,
  CheckInDTO,
  SchedulingDTO,
} from "../../types";

interface IVolunteerService {
  /**
   * Create new Volunteer in database
   * @param volunteer new volunteer object
   * @returns a VolunteerDTO with volunteer's information
   * @throws Error if volunteer creation fails
   */
  createVolunteer(volunteer: Omit<VolunteerDTO, "id">): Promise<VolunteerDTO>;

  /**
   * Get volunteer associated with id
   * @param id volunteer's id
   * @returns a VolunteerDTO with volunteer's information
   * @throws Error if volunteer retrieval fails
   */
  getVolunteerById(id: string): Promise<UserVolunteerDTO>;

  /**
   * Get volunteer associated with user id
   * @param userId id associated with user
   * @returns a VolunteerDTO with volunteer's information
   * @throws Error if volunteer retrieval fails
   */
  getVolunteerByUserId(userId: string): Promise<UserVolunteerDTO>;

  /**
   * Get all volunteer information (possibly paginated in the future)
   * @returns array of VolunteerDTOs
   * @throws Error if volunteer retrieval fails
   */
  getVolunteers(): Promise<Array<UserVolunteerDTO>>;

  /**
   * Get all checkins and schedulings sorted by most recent to least recent
   * @param volunteerId id associated with volunteer
   * @returns all checkins and schedulings sorted by most recent to least recent
   * @throws Error if scheduling or checkin retrieval fails
   */
  getCheckInsAndSchedules(
    volunteerId: string,
  ): Promise<Array<CheckInDTO | SchedulingDTO>>;

  /**
   * Update a volunteer by volunteerId.
   * @param id volunteer's id
   * @param volunteer the volunteer to be updated
   * @throws Error if volunteer update fails
   */
  updateVolunteerById(id: string, volunteer: UpdateVolunteerDTO): Promise<void>;

  /**
   * Update a volunteer by userId.
   * @param userId id associated with user
   * @param volunteer the volunteer to be updated
   * @throws Error if volunteer update fails
   */
  updateVolunteerByUserId(
    userId: string,
    volunteer: UpdateVolunteerDTO,
  ): Promise<void>;

  /**
   * Delete a volunteer by id
   * @param volunteerId volunteer's volunteerId
   * @throws Error if volunteer deletion fails
   */
  deleteVolunteerById(id: string): Promise<void>;
}

export default IVolunteerService;
