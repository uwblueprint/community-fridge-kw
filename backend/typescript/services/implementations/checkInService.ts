import { Op } from "sequelize";
import ICheckInService from "../interfaces/checkInService";
import logger from "../../utilities/logger";
import CheckIn from "../../models/checkIn.model";
import getErrorMessage from "../../utilities/errorMessageUtil";

const Logger = logger(__filename);

class CheckInService implements ICheckInService {
  /* eslint-disable class-methods-use-this */

  async deleteCheckInById(id: string): Promise<void> {
    try {
      const numDestroyed = await CheckIn.destroy({
        where: { id: Number(id) },
      });
      if (numDestroyed <= 0) {
        throw new Error(`checkin with id ${id} was not deleted.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to delete checkin by id. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteCheckInByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<void> {
    const startDateRange = new Date(startDate);
    const endDateRange = new Date(endDate);
    try {
      const numsDestroyed = await CheckIn.destroy({
        where: {
          start_date: {
            [Op.gte]: startDateRange,
          },
          end_date: {
            [Op.lte]: endDateRange,
          },
        },
      });
      if (numsDestroyed <= 0) {
        throw new Error(
          `checkins between start date ${startDate} and end date ${endDate} were not deleted.`,
        );
      }
    } catch (error) {
      Logger.error(
        `Failed to delete checkins by start and end date range. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }
}

export default CheckInService;
