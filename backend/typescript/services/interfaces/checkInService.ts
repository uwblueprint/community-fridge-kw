import { CheckInDTO, CreateCheckInDTO, UpdateCheckInDTO } from "../../types";

interface ICheckInService {
  /**
   * Create check in
   * @param checkIn CreateCheckInDTO object containing check in info
   * @returns a CheckInDTO[] with all the created check ins
   * @throws Error if check in creation fails
   */
  createCheckIn(checkIn: CreateCheckInDTO): Promise<CheckInDTO[]>;

  /**
   * Update checkIn.
   * @param id id of checkIn object
   * @param checkIn UpdateCheckInDTO object containing checkIn info to be updated
   * @returns a CheckInDTO with the updated checkIn information
   * @throws Error if checkIn update fails
   */
  updateCheckInById(id: string, checkIn: UpdateCheckInDTO): Promise<CheckInDTO>;

  /**
   * Gets all checkins from table
   * @throws Error if retrieving checkins fail
   */
  getAllCheckIns(): Promise<CheckInDTO[]>;

  /**
   * Gets checkin by primary key id
   * @param id primary key id
   * @throws Error if retrieving checkin by specific key fails
   */
  getCheckInsById(id: string): Promise<CheckInDTO>;

  /**
   * Gets checkin by volunteerId
   * @param volunteerId volunteer id
   * @throws Error if retrieving checkin by volunteer id fails
   */
  getCheckInsByVolunteerId(volunteerId: string): Promise<CheckInDTO[]>;

  /**
   * Deletes checkin by primary key id
   * @param id checkin's id
   * @throws Error if checkin deletion fails
   */
  deleteCheckInById(id: string): Promise<void>;

  /**
   * Deletes checkin in the specified start and end date range inclusive
   * @param startDate start date of the range
   * @param endDate end date of the range
   */
  deleteCheckInsByDateRange(startDate: string, endDate: string): Promise<void>;

  /**
   * Generate an email with checkin info to admin after a volunteer signs up
   * @param checkIn object that contains information on checkin
   * @throws Error if unable to send email
  */
  sendCheckInSignUpAdminEmail(
    checkIn: CheckInDTO,
  ): Promise<void>;
}

export default ICheckInService;
