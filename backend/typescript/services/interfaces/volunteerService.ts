import { UserVolunteerDTO, UpdateVolunteerDTO } from "../../types";

interface IVolunteerService {
  /**
   * Get volunteer associated with id
   * @param id volunteer's id
   * @returns a VolunteerDTO with volunteer's information
   * @throws Error if volunteer retrieval fails
   */
  getVolunteerById(userId: string): Promise<UserVolunteerDTO>;

  /**
   * Get all volunteer information (possibly paginated in the future)
   * @returns array of VolunteerDTOs
   * @throws Error if volunteer retrieval fails
   */
  getVolunteers(): Promise<Array<UserVolunteerDTO>>;

  /**
   * Update a volunteer.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param volunteerId volunteer's id
   * @param volunteer the volunteer to be updated
   * @throws Error if volunteer update fails
   */
  updateVolunteerById(
    volunteerId: string,
    volunteer: UpdateVolunteerDTO,
  ): Promise<void>;

  /**
   * Delete a volunteer by id
   * @param volunteerId volunteer's volunteerId
   * @throws Error if volunteer deletion fails
   */
  deleteVolunteerById(volunteerId: string): Promise<void>;
}

export default IVolunteerService;
