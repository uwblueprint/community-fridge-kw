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
import { DayPart, Frequency, Status } from "../types";
import Donor from "./donor.model";
import Volunteer from "./volunteer.model";

@Table({ tableName: "scheduling" })
export default class Scheduling extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  categories!: string[];

  @Column({ type: DataType.TEXT })
  size!: string;

  @Column({ type: DataType.BOOLEAN })
  is_pickup!: boolean;

  @Column({ type: DataType.TEXT })
  pickup_location!: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(
      "Early Morning (12am - 6am)",
      "Morning (6am - 11am)",
      "Afternoon (11am - 4pm)",
      "Evening (4pm - 9pm)",
      "Night (9pm - 12am)",
    ),
  })
  day_part!: DayPart;

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
  @Column({ type: DataType.BOOLEAN })
  volunteer_needed!: boolean;

  @Column({ type: DataType.TEXT })
  volunteer_time!: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("One time", "Daily", "Weekly", "Monthly"),
  })
  frequency!: Frequency;

  @Column({ type: DataType.INTEGER })
  recurring_donation_id!: number;

  @Column({ type: DataType.DATE })
  recurring_donation_end_date!: Date;

  @Column({ type: DataType.TEXT })
  notes!: string;

  @ForeignKey(() => Donor)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  donor_id!: number;

  @ForeignKey(() => Volunteer)
  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  volunteer_id!: number;
@BelongsTo(() => Volunteer)
  volunteer!: Volunteer;
  @BelongsTo(() => Donor)
  donor!: Donor;
}
