import User from "../../models/user.model";
import Volunteer from "../../models/volunteer.model";
import { UserVolunteerDTO } from "../../types";
import logger from "../../utilities/logger";
import IVolunteerService from "../interfaces/volunteerService";

const Logger = logger(__filename);

class VolunteerService implements IVolunteerService {
  async getVolunteerById(volunteerId: string): Promise<UserVolunteerDTO> {
    let volunteer: Volunteer | null;
    let user: User | null;

    try {
      volunteer = await Volunteer.findOne({
        where: { user_id: Number(volunteerId) },
        include: User,
      });

      if (!volunteer) {
        throw new Error(`volunteerId ${volunteerId} not found.`);
      }

      user = volunteer.user;
      if (!user) {
        throw new Error(`userId ${volunteer.user_id} not found.`);
      }
    } catch (error: any) {
      Logger.error(`Failed to get volunteer. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: String(volunteer.user_id),
      firstName: user.first_name,
      lastName: user.last_name,
      email: "",
      role: user.role,
      phoneNumber: user.phone_number,
      volunteerId: volunteer.user_id,
      user_id: "id",
    };
  }

  async getVolunteers(): Promise<Array<UserVolunteerDTO>> {
    let userVolunteerDTOs: Array<UserVolunteerDTO> = [];
    // let volunteer: Volunteer | null;
    console.log("hit function");
    return userVolunteerDTOs;
  }

  async updateVolunteerById(volunteerId: string): Promise<void> {
    let volunteer: Volunteer | null;
  }

  async deleteVolunteerById(volunteerId: string): Promise<void> {
    let volunteer: Volunteer | null;
  }
}

export default VolunteerService;
