import {
  Column,
  DataType,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
} from "sequelize-typescript";
import { Status } from "../types";
import Donor from "./donor.model";

@Table({ tableName: "scheduling" })
export default class Scheduling extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  category!: string;

  @Column({ type: DataType.INTEGER })
  quantity!: number;

  @Column({ type: DataType.INTEGER })
  size!: string;

  @Column({ type: DataType.TEXT })
  pickup_location!: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  start_time!: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  end_time!: Date;

  @Column({
    type: DataType.ENUM("Rejected", "Approved", "Pending"),
    defaultValue: "Approved",
  })
  status!: Status;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  volunteers_needed!: number;

  @Column({ type: DataType.TEXT })
  notes!: string;

  @ForeignKey(() => Donor)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  donor_id!: number;

  @BelongsTo(() => Donor)
  donor!: Donor;
}
