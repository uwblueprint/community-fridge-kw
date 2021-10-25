import { VolunteerDTO, UserVolunteerDTO } from "../../types";

interface IVolunteerService {
  createVolunteer(volunteer: Omit<VolunteerDTO, "id">): Promise<VolunteerDTO>;
  /**
   * Get volunteer associated with id
   * @param id volunteer's id
   * @returns a VolunteerDTO with volunteer's information
   * @throws Error if volunteer retrieval fails
   */
  getVolunteerByID(userId: string): Promise<UserVolunteerDTO>;

  /**
   * Get all volunteer information (possibly paginated in the future)
   * @returns array of VolunteerDTOs
   * @throws Error if volunteer retrieval fails
   */
  getVolunteers(): Promise<Array<UserVolunteerDTO>>;

  /**
   * Delete a volunteer by id
   * @param volunteerId volunteer's volunteerId
   * @throws Error if volunteer deletion fails
   */
  deleteVolunteerByID(id: string): Promise<void>;
}

export default IVolunteerService;
