import * as firebaseAdmin from "firebase-admin";
import User from "../../models/user.model";
import Volunteer from "../../models/volunteer.model";
import { UserVolunteerDTO, VolunteerDTO } from "../../types";
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
    } catch (error: any) {
      Logger.error(`Failed to create volunteer. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: newVolunteer.id,
      userId: String(newVolunteer.user_id),
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
    } catch (error: any) {
      Logger.error(`Failed to get volunteer. Reason = ${error.message}`);
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
          };
        }),
      );
    } catch (error: any) {
      Logger.error(`Failed to get volunteers. Reason = ${error.message}`);
      throw error;
    }

    return userVolunteerDTOs;
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
    } catch (error: any) {
      Logger.error(`Failed to delete volunteer. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default VolunteerService;
