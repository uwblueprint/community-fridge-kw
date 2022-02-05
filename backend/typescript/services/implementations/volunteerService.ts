import User from "../../models/user.model";
import Volunteer from "../../models/volunteer.model";
import { Status, UpdateVolunteerDTO, UserVolunteerDTO, VolunteerDTO } from "../../types";
import getErrorMessage from "../../utilities/errorMessageUtil";
import logger from "../../utilities/logger";
import IVolunteerService from "../interfaces/volunteerService";

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
    } catch (error: unknown) {
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

  async getVolunteerByID(volunteerId: string): Promise<UserVolunteerDTO> {
    let volunteer: Volunteer | null;
    let user: User | null;

    try {
      volunteer = await Volunteer.findOne({
        where: { user_id: Number(volunteerId) },
        include: User,
      });

      if (!volunteer) {
        throw new Error(`volunteerID ${volunteerId} not found.`);
      }

      user = volunteer.user;
      if (!user) {
        throw new Error(`userID ${volunteer.user_id} not found.`);
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
    } catch (error: unknown) {
      Logger.error(
        `Failed to get volunteers. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }

    return userVolunteerDTOs;
  }

  async updateVolunteerById(id: string, volunteer: UpdateVolunteerDTO): Promise<void> {
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

  async updateVolunteerByUserId(userId: string, volunteer: UpdateVolunteerDTO): Promise<void> {
    try {
      const updateResult = await Volunteer.update(
        {
          status: volunteer.status,
        },
        {
          where: { userId },
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

  async deleteVolunteerByID(id: string): Promise<void> {
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
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete volunteer. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default VolunteerService;
