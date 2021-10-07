import { Column, DataType, Model, Table, HasOne } from "sequelize-typescript";
import { Role } from "../types";
import Donor from "./donor.model";

@Table({ tableName: "users" })
export default class User extends Model {
  @HasOne(() => Donor, 'user_id')
  donor!: Donor;

  @Column({ type: DataType.STRING })
  first_name!: string;

  @Column({ type: DataType.STRING })
  last_name!: string;

  @Column({ type: DataType.STRING })
  auth_id!: string;

  @Column({ type: DataType.ENUM("User", "Admin") })
  role!: Role;
}
