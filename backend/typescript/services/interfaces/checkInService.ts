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
}

export default ICheckInService;
