import ICheckInService from "../interfaces/checkInService";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class CheckInService implements ICheckInService {
    async deleteCheckInById(id: string): Promise<void> {
    }

    async deleteCheckInByDateRang(startDate: Date, endDate: Date): Promise<void> {
    }
}

export default CheckInService;
