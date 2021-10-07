import { Column, DataType, Model, Table, AllowNull, ForeignKey, BelongsTo, AutoIncrement, PrimaryKey } from "sequelize-typescript";
import { Status } from "../types";
import Donor from "./donor.model";

@Table({ tableName: "scheduling" })
export default class Scheduling extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.TEXT })
  description!: string | null;

  @Column({ type: DataType.INTEGER })
  quantity!: number | null;

  @Column({ type: DataType.TEXT })
  pickup_location!: string | null;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  start_time!: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  end_time!: Date;

  @AllowNull(false)
  @Column({ type: DataType.ENUM("Rejected", "Approved", "Pending") })
  status!: Status;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  volunteers_needed!: number;

  @Column({ type: DataType.TEXT })
  notes!: string | null;

  @ForeignKey(() => Donor)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  donor_id!: number;

  @BelongsTo(() => Donor)
  donor!: Donor;
}
