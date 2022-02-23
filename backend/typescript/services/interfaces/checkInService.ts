interface ICheckInService {
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
    deleteCheckInByDateRang(startDate: Date, endDate: Date): Promise<void>;
}

export default ICheckInService;
