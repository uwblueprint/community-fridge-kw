import {
  VolunteerDTO,
  UserVolunteerDTO,
  UpdateVolunteerDTO,
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
   * Update a volunteer by volunteerId.
   * @param id volunteer's id
   * @param volunteer the volunteer to be updated
   * @throws Error if volunteer update fails
   */
  updateVolunteerById(id: string, volunteer: UpdateVolunteerDTO): Promise<void>;

  /**
   * Update a volunteer by userID.
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
  deleteVolunteerByID(id: string): Promise<void>;
}

export default IVolunteerService;
