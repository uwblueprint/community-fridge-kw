import {
  DonorDTO
} from "../../types"
import IDonorService from "../interfaces/donorService";
import logger from "../../utilities/logger";

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
      id: donor.id,
      firstName: donor.first_name,
      lastName: donor.last_name,
      email: donor.email ?? "",
      role: donor.role, //TODO: this needs to be removed
      donorType: donor.donor_type,
      facebookLink: donor.facebook_link,
      instagramLink: donor.instagram_link,
      recurringDonor: donor.recurring_donor,
      businessName: donor.businessName
    }
  }

  async getDonors(): Promise<Array<DonorDTO>> {
    let donorDtos: Array<DonorDTO> = [];
    try {
      const donors: Array<Donor> = await Donor.findAll();

      donorDtos = await Promise.all(
        donors.map(async (donor) => {
          return {
            id: donor.id,
            firstName: donor.first_name,
            lastName: donor.last_name,
            email: donor.email ?? "",
            role: donor.role, //TODO: this needs to be removed
            donorType: donor.donor_type,
            facebookLink: donor.facebook_link,
            instagramLink: donor.instagram_link,
            recurringDonor: donor.recurring_donor,
            businessName: donor.businessName
          };
        }),
      );
    } catch (error) {
      Logger.error(`Failed to get donors. Reason = ${error.message}`);
      throw error;
    }

    return donorDtos;
  }
}

export default DonorService;