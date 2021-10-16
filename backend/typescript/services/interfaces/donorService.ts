import {
  UpdateDonorDTO,
  UserDonorDTO
} from "../../types"

interface IDonorService {

  /**
   * Get donor associated with id
   * @param donorId donors's id
   * @returns a UserDonorDTO with donor's information
   * @throws Error if donor retrieval fails
   */
  getDonorById(donorId: string): Promise<UserDonorDTO>;


  /**
   * Get all donor information (possibly paginated in the future)
   * @returns array of UserDonorDTO
   * @throws Error if donors retrieval fails
   */
  getDonors(): Promise<Array<UserDonorDTO>>;

  /**
   * Update a donor.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param donorId donor's id
   * @param donor the donor to be updated
   * @throws Error if donor update fails
   */
  updateDonorById(donorId: string, donor: UpdateDonorDTO): Promise<void>;

  /**
   * Delete a donor by id
   * @param donorId donor's donorId
   * @throws Error if donor deletion fails
   */
  deleteDonorById(donorId: string): Promise<void>;
}

export default IDonorService;