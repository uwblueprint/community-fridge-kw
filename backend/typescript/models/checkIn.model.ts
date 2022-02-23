import {
  Column,
  DataType,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  AutoIncrement,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import Volunteer from "./volunteer.model";

@Table({ tableName: "checkin" })
export default class CheckIn extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @BelongsTo(() => Volunteer)
  volunteer!: Volunteer;

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
