import {
  DonorDTO,
  CreateDonorDTO,
  UpdateDonorDTO
} from "../../types"

interface IDonorService {

  /**
   * Get donor associated with id
   * @param donorId donors's id
   * @returns a DonorDTO with donor's information
   * @throws Error if donor retrieval fails
   */
  getDonorById(donorId: string): Promise<DonorDTO>;


  /**
   * Get all donor information (possibly paginated in the future)
   * @returns array of DonorDTOs
   * @throws Error if donors retrieval fails
   */
  getDonors(): Promise<Array<DonorDTO>>;

  /**
   * Update a donor.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param donorId donor's id
   * @param donor the donor to be updated
   * @returns a DonorDTO with the updated donor's information
   * @throws Error if donor update fails
   */
  updateDonorById(donorId: string, donor: UpdateDonorDTO): Promise<DonorDTO>;

  /**
   * Delete a donor by id
   * @param donorId donor's donorId
   * @throws Error if donor deletion fails
   */
  deleteDonorById(donorId: string): Promise<void>;
}

export default IDonorService;