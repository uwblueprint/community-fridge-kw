import {
  DonorDTO, UpdateDonorDTO
} from "../../types"
import IDonorService from "../interfaces/donorService";
import logger from "../../utilities/logger";
import Donor from "../../models/donor.model"

const Logger = logger(__filename);

class DonorService implements IDonorService {

  async getDonorById(donorId: string): Promise<DonorDTO> {
    let donor: Donor | null;
    
    try {
      donor = await Donor.findByPk(Number(donorId));

      if (!donor) {
        throw new Error(`donorId ${donorId} not found.`)
      }
    } catch (error) {
      Logger.error(`Failed to get donor. Reason = ${error.message}`);
      throw error;
    }

    return {
      donorId: donor.user_id,
      donorType: donor.donor_type,
      facebookLink: donor.facebook_link,
      instagramLink: donor.instagram_link,
      recurringDonor: donor.recurring_donor,
      businessName: donor.business_name
    }
  }

  async getDonors(): Promise<Array<DonorDTO>> {
    let donorDtos: Array<DonorDTO> = [];
    try {
      const donors: Array<Donor> = await Donor.findAll();

      donorDtos = await Promise.all(
        donors.map(async (donor) => {
          return {
            donorId: donor.user_id,
            donorType: donor.donor_type,
            facebookLink: donor.facebook_link,
            instagramLink: donor.instagram_link,
            recurringDonor: donor.recurring_donor,
            businessName: donor.business_name
          };
        }),
      );
    } catch (error) {
      Logger.error(`Failed to get donors. Reason = ${error.message}`);
      throw error;
    }

    return donorDtos;
  }

  async updateDonorById(donorId: string, donor: UpdateDonorDTO): Promise<DonorDTO> {
    try {
      const updateResult = await Donor.update(
        {
          donorType: donor.donorType,
          facebookLink: donor.facebookLink,
          instagramLink: donor.instagramLink,
          recurringDonor: donor.recurringDonor,
          businessName: donor.businessName
        },
        {
          where: { id: donorId },
          returning: true,
        },
      );

      // check number of rows affected
      if (updateResult[0] < 1) {
        throw new Error(`donorId ${donorId} not found.`);
      }
      
    } catch (error) {
      Logger.error(`Failed to update donor. Reason = ${error.message}`);
      throw error;
    }

    return {
      donorId: Number(donorId),
      donorType: donor.donorType,
      facebookLink: donor.facebookLink,
      instagramLink: donor.instagramLink,
      recurringDonor: donor.recurringDonor,
      businessName: donor.businessName
    };
  }

  async deleteDonorById(donorId: string): Promise<DonorDTO> {
    try {
      const deletedRole: Donor | null = await Donor.findByPk(Number(donorId));

      if (!deletedRole) {
        throw new Error(`donorid ${donorId} not found.`);
      }

      const numDestroyed: number = await Donor.destroy({
        where: { id: donorId },
      });

      if (numDestroyed <= 0) {
        throw new Error(`donorId ${donorId} was not deleted in Postgres.`);
      }
    } catch (error) {
      Logger.error(`Failed to delete donor. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default DonorService;