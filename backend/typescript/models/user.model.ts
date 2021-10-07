import { Column, DataType, Model, Table, HasOne, AllowNull} from "sequelize-typescript";
import { DataTypes } from "sequelize/types";
import { Role } from "../types";
import Donor from "./donor.model";

@Table({ tableName: "users" })
export default class User extends Model {
  @HasOne(() => Donor, 'user_id')
  @AllowNull(false)
  donor!: Donor;

  @Column({ type: DataType.STRING })
  first_name!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  last_name!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  auth_id!: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM("User", "Admin", "Volunteer", "Donor") })
  role!: Role;

  @Column({ type: DataTypes.STRING })
  phone_number!: string;
}
