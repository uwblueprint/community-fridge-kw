import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "../types";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({ type: DataType.INTEGER})
  id!: number;

  @Column({ type: DataType.STRING })
  email!: string;

  @Column({ type: DataType.STRING })
  first_name!: string;

  @Column({ type: DataType.STRING })
  last_name!: string;

  @Column({ type: DataType.STRING })
  phone_number!: string;

  @Column({ type: DataType.UUID })
  firebase_uuid!: string;

  @Column({ type: DataType.ENUM("User", "Admin", "Donor") })
  role!: Role;
}
