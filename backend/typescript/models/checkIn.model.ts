import {
  Column,
  DataType,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  AutoIncrement,
  PrimaryKey,
} from "sequelize-typescript";
import Volunteer from "./volunteer.model";

@Table({ tableName: "check_in" })
export default class Scheduling extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @ForeignKey(() => Volunteer)
  @Column({ type: DataType.INTEGER })
  volunteer_id!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  start_date!: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  end_date!: Date;

  @Column({ type: DataType.TEXT })
  notes!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_admin!: boolean;
}
