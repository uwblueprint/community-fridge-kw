import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Status } from "../types";

@Table({ tableName: "scheduling" })
export default class Scheduling extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true })
  id!: number;

  // TODO: donor_id should be made a foreign key
  // reference to the donors table once it is created
  @Column({ type: DataType.INTEGER })
  donor_id!: string;

  @Column({ type: DataType.TEXT })
  description!: string | null;

  @Column({ type: DataType.INTEGER })
  quantity!: number | null;

  @Column({ type: DataType.DATE })
  start_time!: Date;

  @Column({ type: DataType.DATE })
  end_time!: Date;

  @Column({ type: DataType.ENUM("Rejected", "Approved", "Pending") })
  status!: Status;

  @Column({ type: DataType.INTEGER })
  volunteers_needed!: number;

  // TODO: volunteer_ids should be foreign key references
  // to the volunteer table once it is created, may have
  // to create another table 'schedule_volunteer_mapping'
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  volunteer_ids!: number[] | null;

  @Column({ type: DataType.TEXT })
  notes!: string | null;
}
