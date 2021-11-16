import {
  DonorDTO,
  UpdateDonorDTO,
  UserDonorDTO,
  CreateDonorDTO,
} from "../../types";
import IDonorService from "../interfaces/donorService";
import logger from "../../utilities/logger";
import Donor from "../../models/donor.model";
import User from "../../models/user.model";

const Logger = logger(__filename);

class DonorService implements IDonorService {
  /* eslint-disable class-methods-use-this */

  async getDonorById(id: string): Promise<UserDonorDTO> {
    let donor: Donor | null;
    let user: User | null;

    try {
      donor = await Donor.findByPk(Number(id), { include: User });

      if (!donor) {
        throw new Error(`id ${id} not found.`);
      }

      user = donor.user;
      if (!user) {
        throw new Error(`userId ${donor.user_id} not found.`);
      }
    } catch (error) {
      Logger.error(`Failed to get donor. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: String(donor.id),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phone_number,
      userId: String(donor.user_id),
      facebookLink: donor.facebook_link,
      instagramLink: donor.instagram_link,
      businessName: donor.business_name,
    };
  }

  async getDonorByUserId(userId: string): Promise<any> {
    let donor: Donor | null;
    let user: User | null;

    try {
      donor = await Donor.findOne({
        where: { user_id: Number(userId) },
        include: User,
      });

      if (!donor) {
        throw new Error(`donor with userid ${userId} not found.`);
      }
      user = donor.user;
      if (!user) {
        throw new Error(`user with userid ${userId} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to get donor. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: String(donor.id),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phone_number,
      userId: String(donor.user_id),
      facebookLink: donor.facebook_link,
      instagramLink: donor.instagram_link,
      businessName: donor.business_name,
    };
  }

  async getDonors(): Promise<Array<UserDonorDTO>> {
    let userDonorDTOs: Array<UserDonorDTO> = [];
    try {
      const donors: Array<Donor> = await Donor.findAll({ include: User });

      userDonorDTOs = await Promise.all(
        donors.map(async (donor) => {
          const { user } = donor;

          if (!user) {
            throw new Error(`userId ${donor.user_id} not found.`);
          }

          return {
            id: String(donor.id),
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phone_number,
            userId: String(donor.user_id),
            facebookLink: donor.facebook_link,
            instagramLink: donor.instagram_link,
            businessName: donor.business_name,
          };
        }),
      );
    } catch (error) {
      Logger.error(`Failed to get donors. Reason = ${error.message}`);
      throw error;
    }

    return userDonorDTOs;
  }

  async updateDonorById(id: string, donor: UpdateDonorDTO): Promise<void> {
    try {
      const updateResult = await Donor.update(
        {
          facebook_link: donor.facebookLink,
          instagram_link: donor.instagramLink,
          business_name: donor.businessName,
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
      Logger.error(`Failed to update donor. Reason = ${error.message}`);
      throw error;
    }
  }

  async deleteDonorById(id: string): Promise<void> {
    try {
      const deletedRole: Donor | null = await Donor.findByPk(Number(id));

      if (!deletedRole) {
        throw new Error(`id ${id} not found.`);
      }

      const numDestroyed: number = await Donor.destroy({
        where: { id },
      });

      if (numDestroyed <= 0) {
        throw new Error(`id ${id} was not deleted in Postgres.`);
      }
    } catch (error) {
      Logger.error(`Failed to delete donor. Reason = ${error.message}`);
      throw error;
    }
  }

  async createDonor(donor: CreateDonorDTO): Promise<DonorDTO> {
    const newDonor = await Donor.create({
      user_id: donor.userId,
      facebook_link: donor.facebookLink,
      instagram_link: donor.instagramLink,
      business_name: donor.businessName,
    });

    return {
      id: String(newDonor.id),
      userId: String(newDonor.user_id),
      facebookLink: newDonor.facebook_link,
      instagramLink: newDonor.instagram_link,
      businessName: newDonor.business_name,
    };
  }
}

export default DonorService;
