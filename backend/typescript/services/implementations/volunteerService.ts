import dayjs from "dayjs";
import CheckIn from "../../models/checkIn.model";
import Scheduling from "../../models/scheduling.model";
import User from "../../models/user.model";
import Volunteer from "../../models/volunteer.model";
import {
  CheckInDTOWithShiftType,
  SchedulingDTOWithShiftType,
  UpdateVolunteerDTO,
  UserVolunteerDTO,
  VolunteerDTO,
  ShiftType,
} from "../../types";
import getErrorMessage from "../../utilities/errorMessageUtil";
import logger from "../../utilities/logger";
import ICheckInService from "../interfaces/checkInService";
import ISchedulingService from "../interfaces/schedulingService";
import IVolunteerService from "../interfaces/volunteerService";
import { getDateWithVolunteerTime } from "../../utilities/servicesUtils";
import IDonorService from "../interfaces/donorService";
import DonorService from "./donorService";
import CheckInService from "./checkInService";
import SchedulingService from "./schedulingService";
import nodemailerConfig from "../../nodemailer.config";
import IEmailService from "../interfaces/emailService";
import EmailService from "./emailService";
import IContentService from "../interfaces/contentService";
import ContentService from "./contentService";

const Logger = logger(__filename);

class VolunteerService implements IVolunteerService {
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

  async getCheckInsAndSchedules(
    volunteerId: string,
  ): Promise<(CheckInDTOWithShiftType | SchedulingDTOWithShiftType)[]> {
    const donorService: IDonorService = new DonorService();
    const emailService: IEmailService = new EmailService(nodemailerConfig);
    const contentService: IContentService = new ContentService();
    const checkInService: ICheckInService = new CheckInService(emailService, this, contentService);

    const schedulingService: ISchedulingService = new SchedulingService(
      emailService,
      this,
      donorService,
      contentService
    );
    const checkIns: CheckInDTOWithShiftType[] = await (
      await checkInService.getCheckInsByVolunteerId(volunteerId)
    ).map((checkIn) => ({ ...checkIn, type: ShiftType.CHECKIN }));
    const schedulings: SchedulingDTOWithShiftType[] = await (
      await schedulingService.getSchedulingsByVolunteerId(volunteerId)
    ).map((scheduling) => ({ ...scheduling, type: ShiftType.SCHEDULING }));
    const shifts: (CheckInDTOWithShiftType | SchedulingDTOWithShiftType)[] = [
      ...checkIns,
      ...schedulings,
    ].sort((a, b) => {
      const date1 =
        a.type === ShiftType.CHECKIN
          ? dayjs(a.startDate)
          : getDateWithVolunteerTime(a.startTime, a.volunteerTime!);
      const date2 =
        b.type === ShiftType.CHECKIN
          ? dayjs(b.startDate)
          : getDateWithVolunteerTime(b.startTime, b.volunteerTime);
      return date2.isBefore(date1) ? 1 : -1;
    });
    return shifts;
  }

  async updateVolunteerById(
    id: string,
    volunteer: UpdateVolunteerDTO,
  ): Promise<VolunteerDTO> {
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
      const updatedVolunteer = updateResult[1][0];

      const updatedVolunteerDTO: VolunteerDTO = {
        id: String(updatedVolunteer.id),
        userId: String(updatedVolunteer.user_id),
        status: updatedVolunteer.status,
      };
      return updatedVolunteerDTO;
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
  ): Promise<VolunteerDTO> {
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

      const updatedVolunteer = updateResult[1][0];

      const updatedVolunteerDTO: VolunteerDTO = {
        id: String(updatedVolunteer.id),
        userId: String(updatedVolunteer.user_id),
        status: updatedVolunteer.status,
      };
      return updatedVolunteerDTO;
    } catch (error) {
      Logger.error(
        `Failed to update volunteer. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteVolunteerById(id: string): Promise<void> {
    try {
      const deletedVolunteer: Volunteer | null = await Volunteer.findByPk(
        Number(id),
      );

      if (!deletedVolunteer) {
        throw new Error(`volunteerId ${id} not found.`);
      }

      try {
        await Scheduling.update(
          {
            volunteer_id: null,
          },
          {
            where: { volunteer_id: deletedVolunteer.id },
          },
        );
      } catch (error) {
        Logger.error(
          `Failed to remove volunteerId from schedule. Reason = ${getErrorMessage(
            error,
          )}`,
        );
        throw error;
      }

      try {
        await CheckIn.update(
          {
            volunteer_id: null,
          },
          {
            where: { volunteer_id: deletedVolunteer.id },
          },
        );
      } catch (error) {
        Logger.error(
          `Failed to remove volunteerId from checkin. Reason = ${getErrorMessage(
            error,
          )}`,
        );
        throw error;
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
