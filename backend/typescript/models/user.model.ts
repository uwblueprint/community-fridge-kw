import {
  Column,
  DataType,
  Model,
  Table,
  AllowNull,
} from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { Role } from "../types";

@Table({ tableName: "users" })
export default class User extends Model {
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
