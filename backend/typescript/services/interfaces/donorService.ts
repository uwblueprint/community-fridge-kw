import {
  UpdateDonorDTO,
  UserDonorDTO,
  DonorDTO,
  CreateDonorDTO,
} from "../../types";

interface IDonorService {
  /**
   * Get donor associated with id
   * @param id donors's id
   * @returns a UserDonorDTO with donor's information
   * @throws Error if donor retrieval fails
   */
  getDonorById(id: string): Promise<UserDonorDTO>;

  /**
   * Get donor associated with a user id
   * @param userId id associated with user
   * @returns a UserDonorDTO with donor's information
   * @throws Error if donor retrieval fails
   */
  getDonorByUserId(userId: string): Promise<UserDonorDTO>;

  /**
   * Get all donor information (possibly paginated in the future)
   * @returns array of UserDonorDTO
   * @throws Error if donors retrieval fails
   */
  getDonors(): Promise<Array<UserDonorDTO>>;

  /**
   * Create new Donor in database
   * @param donor is a new donor object
   * @returns a DonorDTO with Donor's information
   * @throws Error if donor creation fails
   */
  createDonor(donor: CreateDonorDTO): Promise<DonorDTO>;

  /**
   * Update a donor.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param id donor's id
   * @param donor the donor to be updated
   * @throws Error if donor update fails
   */
  updateDonorById(id: string, donor: UpdateDonorDTO): Promise<void>;

  /**
   * Delete a donor by id
   * @param id donor's id
   * @throws Error if donor deletion fails
   */
  deleteDonorById(id: string): Promise<void>;
}

export default IDonorService;
