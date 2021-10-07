import { Column, DataType, Model, Table, HasOne } from "sequelize-typescript";
import { Role } from "../types";
import Volunteer from "./volunteer.model";

@Table({ tableName: "users" })
export default class User extends Model {
  @HasOne(() => Volunteer, 'user_id')
  volunteer!: Volunteer;

  @Column({ type: DataType.STRING })
  first_name!: string;

  @Column({ type: DataType.STRING })
  last_name!: string;

  @Column({ type: DataType.STRING })
  auth_id!: string;

  @Column({ type: DataType.ENUM("User", "Admin") })
  role!: Role;
}
