import { Column, DataType, Model, Table, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import User from "./user.model"

@Table({ tableName: "donors" })
export default class Donor extends Model {
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.STRING })
  business_name!: string;

  @Column({ type: DataType.STRING })
  facebook_link?: string;

  @Column({ type: DataType.STRING })
  instagram_link?: string;
}
