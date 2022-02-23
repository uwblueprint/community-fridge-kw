import { CheckInDTO } from "../../../types";

interface ICheckInService {
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
    deleteCheckInByDateRange(startDate: string, endDate: string): Promise<void>;
}

export default ICheckInService;
