import * as firebaseAdmin from "firebase-admin";
import IUserService from "../interfaces/userService";
import { CreateUserDTO, Role, UpdateUserDTO, UserDTO } from "../../types";
import logger from "../../utilities/logger";
import User from "../../models/user.model";
import getErrorMessage from "../../utilities/errorMessageUtil";
import Donor from "../../models/donor.model";
import Volunteer from "../../models/volunteer.model";
import IDonorService from "../interfaces/donorService";
import DonorService from "./donorService";
import IVolunteerService from "../interfaces/volunteerService";
import VolunteerService from "./volunteerService";

const Logger = logger(__filename);

class UserService implements IUserService {
  /* eslint-disable class-methods-use-this */

  async getUserById(userId: string): Promise<UserDTO> {
    let user: User | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      user = await User.findByPk(Number(userId));

      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      firebaseUser = await firebaseAdmin.auth().getUser(user.auth_id);
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: firebaseUser.email ?? "",
      role: user.role,
      phoneNumber: user.phone_number,
    };
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    let user: User | null;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      user = await User.findOne({
        where: { auth_id: firebaseUser.uid },
      });

      if (!user) {
        throw new Error(`userId with authID ${firebaseUser.uid} not found.`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: firebaseUser.email ?? "",
      role: user.role,
      phoneNumber: user.phone_number,
    };
  }

  async getUserRoleByAuthId(authId: string): Promise<Role> {
    try {
      const user: User | null = await User.findOne({
        where: { auth_id: authId },
      });
      if (!user) {
        throw new Error(`userId with authId ${authId} not found.`);
      }
      return user.role;
    } catch (error: unknown) {
      Logger.error(
        `Failed to get user role. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getUserIdByAuthId(authId: string): Promise<string> {
    try {
      const user: User | null = await User.findOne({
        where: { auth_id: authId },
      });
      if (!user) {
        throw new Error(`user with authId ${authId} not found.`);
      }
      return user.id;
    } catch (error: unknown) {
      Logger.error(`Failed to get user id. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getAuthIdById(userId: string): Promise<string> {
    try {
      const user: User | null = await User.findByPk(Number(userId));
      if (!user) {
        throw new Error(`userId ${userId} not found.`);
      }
      return user.auth_id;
    } catch (error: unknown) {
      Logger.error(`Failed to get authId. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getUsers(): Promise<Array<UserDTO>> {
    let userDtos: Array<UserDTO> = [];
    try {
      const users: Array<User> = await User.findAll();

      userDtos = await Promise.all(
        users.map(async (user) => {
          let firebaseUser: firebaseAdmin.auth.UserRecord;

          try {
            firebaseUser = await firebaseAdmin.auth().getUser(user.auth_id);
          } catch (error) {
            Logger.error(
              `user with authId ${user.auth_id} could not be fetched from Firebase`,
            );
            throw error;
          }

          return {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: firebaseUser.email ?? "",
            role: user.role,
            phoneNumber: user.phone_number,
          };
        }),
      );
    } catch (error: unknown) {
      Logger.error(`Failed to get users. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return userDtos;
  }

  async createUser(
    user: CreateUserDTO,
    authId?: string,
    signUpMethod = "PASSWORD",
  ): Promise<UserDTO> {
    let newUser: User;
    let firebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      if (signUpMethod === "GOOGLE") {
        firebaseUser = await firebaseAdmin.auth().getUser(authId!);
      } else {
        // signUpMethod === PASSWORD
        firebaseUser = await firebaseAdmin.auth().createUser({
          email: user.email,
          password: user.password,
        });
      }

      try {
        newUser = await User.create({
          first_name: user.firstName,
          last_name: user.lastName,
          auth_id: firebaseUser.uid,
          email: user.email,
          role: user.role,
          phone_number: user.phoneNumber,
        });
      } catch (postgresError) {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (firebaseError: unknown) {
          const errorMessage = [
            "Failed to rollback Firebase user creation after Postgres user creation failure. Reason =",
            getErrorMessage(firebaseError),
            "Orphaned authId (Firebase uid) =",
            firebaseUser.uid,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw postgresError;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to create user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: firebaseUser.email ?? "",
      role: newUser.role,
      phoneNumber: newUser.phone_number,
    };
  }

  async updateUserById(userId: string, user: UpdateUserDTO): Promise<UserDTO> {
    let updatedFirebaseUser: firebaseAdmin.auth.UserRecord;

    try {
      const updateResult = await User.update(
        {
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role,
          phone_number: user.phoneNumber,
        },
        {
          where: { id: userId },
          returning: true,
        },
      );

      // check number of rows affected
      if (updateResult[0] < 1) {
        throw new Error(`userId ${userId} not found.`);
      }

      // the cast to "any" is needed due to a missing property in the Sequelize type definitions
      // https://github.com/sequelize/sequelize/issues/9978#issuecomment-426342219
      /* eslint-disable-next-line no-underscore-dangle */
      const oldUser: User = (updateResult[1][0] as any)._previousDataValues;

      try {
        updatedFirebaseUser = await firebaseAdmin
          .auth()
          .updateUser(oldUser.auth_id, { email: user.email });
      } catch (error) {
        // rollback Postgres user updates
        try {
          await User.update(
            {
              first_name: oldUser.first_name,
              last_name: oldUser.last_name,
              role: oldUser.role,
              phone_number: oldUser.phone_number,
            },
            {
              where: { id: userId },
            },
          );
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user update after Firebase user update failure. Reason =",
            getErrorMessage(postgresError),
            "Postgres user id with possibly inconsistent data =",
            oldUser.id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: updatedFirebaseUser.email ?? "",
      role: user.role,
      phoneNumber: user.phoneNumber,
    };
  }

  async deleteUserById(userId: string): Promise<void> {
    const donorService: IDonorService = new DonorService();
    const volunteerService: IVolunteerService = new VolunteerService();
    try {
      // Sequelize doesn't provide a way to atomically find, delete, and return deleted row
      const deletedUser: User | null = await User.findByPk(Number(userId));
      let deletedDonor: Donor | null = null;
      let deletedVolunteer: Volunteer | null = null;
      if (!deletedUser) {
        throw new Error(`userid ${userId} not found.`);
      }
      if (deletedUser.role === Role.DONOR) {
        deletedDonor = await Donor.findOne({
          where: {
            user_id: Number(userId),
          },
        });

        if (!deletedDonor) {
          throw new Error(`Donor with userid ${userId} not found.`);
        }
        await donorService.deleteDonorById(deletedDonor.id);
      } else if (deletedUser.role === Role.VOLUNTEER) {
        deletedVolunteer = await Volunteer.findOne({
          where: {
            user_id: Number(userId),
          },
        });
        if (!deletedVolunteer) {
          throw new Error(`Volunteer with userid ${userId} not found.`);
        }
        await volunteerService.deleteVolunteerById(deletedVolunteer.id);
      }
      const numDestroyed: number = await User.destroy({
        where: { id: userId },
      });

      if (numDestroyed <= 0) {
        throw new Error(`userid ${userId} was not deleted in Postgres.`);
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.auth_id);
      } catch (error) {
        // rollback user deletion in Postgres
        try {
          await User.create({
            first_name: deletedUser.first_name,
            last_name: deletedUser.last_name,
            auth_id: deletedUser.auth_id,
            email: deletedUser.email,
            role: deletedUser.role,
            phone_number: deletedUser.phone_number,
          });
          if (deletedUser.role === Role.DONOR && deletedDonor) {
            await Donor.create({
              user_id: deletedUser.id,
              facebook_link: deletedDonor.facebook_link,
              instagram_link: deletedDonor.instagram_link,
              business_name: deletedDonor.business_name,
            });
          } else if (deletedUser.role === Role.VOLUNTEER && deletedVolunteer) {
            await Volunteer.create({
              user_id: deletedUser.id,
              status: deletedVolunteer.status,
            });
          }
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedUser.auth_id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const firebaseUser: firebaseAdmin.auth.UserRecord = await firebaseAdmin
        .auth()
        .getUserByEmail(email);
      const deletedUser: User | null = await User.findOne({
        where: { auth_id: firebaseUser.uid },
      });

      if (!deletedUser) {
        throw new Error(`userid ${firebaseUser.uid} not found.`);
      }

      const numDestroyed: number = await User.destroy({
        where: { auth_id: firebaseUser.uid },
      });

      if (numDestroyed <= 0) {
        throw new Error(
          `userid ${firebaseUser.uid} was not deleted in Postgres.`,
        );
      }

      try {
        await firebaseAdmin.auth().deleteUser(deletedUser.auth_id);
      } catch (error) {
        // rollback user deletion in Postgres
        try {
          await User.create({
            first_name: deletedUser.first_name,
            last_name: deletedUser.last_name,
            auth_id: deletedUser.auth_id,
            email: deletedUser.email,
            role: deletedUser.role,
            phone_number: deletedUser.phone_number,
          });
        } catch (postgresError: unknown) {
          const errorMessage = [
            "Failed to rollback Postgres user deletion after Firebase user deletion failure. Reason =",
            getErrorMessage(postgresError),
            "Firebase uid with non-existent Postgres record =",
            deletedUser.auth_id,
          ];
          Logger.error(errorMessage.join(" "));
        }

        throw error;
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete user. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default UserService;
