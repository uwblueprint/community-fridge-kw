import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";
import { Status } from "../types";
import User from "./user.model";

@Table({ tableName: "volunteers" })
export default class Volunteer extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("Rejected", "Approved", "Pending"),
    defaultValue: "Pending",
  })
  status!: Status;
}
