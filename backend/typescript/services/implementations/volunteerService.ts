import User from "../../models/user.model";
import Volunteer from "../../models/volunteer.model";
import {
  CheckInDTO,
  SchedulingDTO,
  UpdateVolunteerDTO,
  UserVolunteerDTO,
  VolunteerDTO,
  ShiftType
} from "../../types";
import getErrorMessage from "../../utilities/errorMessageUtil";
import logger from "../../utilities/logger";
import ICheckInService from "../interfaces/checkInService";
import ISchedulingService from "../interfaces/schedulingService";
import IVolunteerService from "../interfaces/volunteerService";

const Logger = logger(__filename);

class VolunteerService implements IVolunteerService {
  checkInService: ICheckInService;

  schedulingService: ISchedulingService;

  constructor(
    checkInService: ICheckInService,
    schedulingService: ISchedulingService
  ) {
    this.checkInService = checkInService;
    this.schedulingService = schedulingService;
  }
  /* eslint-disable class-methods-use-this */

  async createVolunteer(
    volunteer: Omit<VolunteerDTO, "id">,
  ): Promise<VolunteerDTO> {
    let newVolunteer: Volunteer;

    try {
      newVolunteer = await Volunteer.create({
        user_id: volunteer.userId,
      });
    } catch (error) {
      Logger.error(
        `Failed to create volunteer. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
      id: newVolunteer.id,
      userId: String(newVolunteer.user_id),
      status: newVolunteer.status,
    };
  }

  async getVolunteerById(volunteerId: string): Promise<UserVolunteerDTO> {
    let volunteer: Volunteer | null;
    let user: User | null;

    try {
      volunteer = await Volunteer.findByPk(Number(volunteerId), {
        include: User,
      });

      if (!volunteer) {
        throw new Error(`volunteerId ${volunteerId} not found.`);
      }

      user = volunteer.user;
      if (!user) {
        throw new Error(`userId ${volunteer.user_id} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to get volunteer. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
      id: String(volunteer.id),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phone_number,
      userId: String(volunteer.user_id),
      status: volunteer.status,
    };
  }

  async getVolunteerByUserId(userId: string): Promise<UserVolunteerDTO> {
    let volunteer: Volunteer | null;
    let user: User | null;

    try {
      volunteer = await Volunteer.findOne({
        where: { user_id: Number(userId) },
        include: User,
      });

      if (!volunteer) {
        throw new Error(`volunteer with userId ${userId} not found.`);
      }

      user = volunteer.user;
      if (!user) {
        throw new Error(`volunteer with userId ${userId} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to get volunteer. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return {
      id: String(volunteer.id),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phone_number,
      userId: String(volunteer.user_id),
      status: volunteer.status,
    };
  }

  async getVolunteers(): Promise<Array<UserVolunteerDTO>> {
    let userVolunteerDTOs: Array<UserVolunteerDTO> = [];

    try {
      const volunteers: Array<Volunteer> = await Volunteer.findAll({
        include: User,
      });

      userVolunteerDTOs = await Promise.all(
        volunteers.map(async (volunteer) => {
          const { user } = volunteer;

          if (!user) {
            throw new Error(`userId ${volunteer.user_id} not found.`);
          }

          return {
            id: String(volunteer.id),
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phone_number,
            userId: String(volunteer.user_id),
            status: volunteer.status,
          };
        }),
      );
    } catch (error) {
      Logger.error(
        `Failed to get volunteers. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return userVolunteerDTOs;
  }

  async getCheckInsAndSchedules(volunteerId: string): Promise<(CheckInDTO | SchedulingDTO)[]> {
      const checkIns = await (await this.checkInService.getCheckInsByVolunteerId(volunteerId)).map(checkIn => ({ ...checkIn, type: ShiftType.CHECKIN }));
      const schedulings = await (await this.schedulingService.getSchedulingsByVolunteerId(volunteerId)).map(scheduling => ({ ...scheduling, type: ShiftType.SCHEDULING }));
      const shifts = [...checkIns, ...schedulings].sort((a, b) => {
        const date1: Date = 'startDate' in a ? new Date(a.startDate) : new Date(a.startTime)
        const date2: Date = 'startDate' in b ? new Date(b.startDate) : new Date(b.startTime)
        return date2.valueOf() - date1.valueOf();
      });
      return shifts;
  }

  async updateVolunteerById(
    id: string,
    volunteer: UpdateVolunteerDTO,
  ): Promise<void> {
    try {
      const updateResult = await Volunteer.update(
        {
          status: volunteer.status,
        },
        {
          where: { id },
          returning: true,
        },
      );

      // check number of rows affected
      if (updateResult[0] < 1) {
        throw new Error(`id ${id} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to update volunteer. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async updateVolunteerByUserId(
    userId: string,
    volunteer: UpdateVolunteerDTO,
  ): Promise<void> {
    try {
      const updateResult = await Volunteer.update(
        {
          status: volunteer.status,
        },
        {
          where: { user_id: userId },
          returning: true,
        },
      );

      // check number of rows affected
      if (updateResult[0] < 1) {
        throw new Error(`userId ${userId} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to update volunteer. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteVolunteerById(id: string): Promise<void> {
    try {
      const deletedRole: Volunteer | null = await Volunteer.findByPk(
        Number(id),
      );

      if (!deletedRole) {
        throw new Error(`id ${id} not found.`);
      }

      const numDestroyed: number = await Volunteer.destroy({
        where: { id },
      });

      if (numDestroyed <= 0) {
        throw new Error(`id ${id} was not deleted in Postgres.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to delete volunteer. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default VolunteerService;
