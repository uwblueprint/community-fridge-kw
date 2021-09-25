import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Status } from "../types";

@Table({ tableName: "scheduling" })
export default class Scheduling extends Model {
  @Column({ type: DataType.INTEGER })
  @Unique 
  @PrimaryKey
  id!: number;

  @Column({ type: DataType.INTEGER })
  donor_id!: string;

  @Column({ type: DataType.STRING })
  auth_id!: string;

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

  @Column({ type: DataType.BOOLEAN })
  volunteer_needed!: boolean;

  @Column({ type: DataType.INTEGER })
  volunteer_id!: number | null;

  @Column({ type: DataType.TEXT })
  notes!: string | null;
}
