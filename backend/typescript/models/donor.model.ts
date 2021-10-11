import { Column, DataType, Model, Table, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import { DonorRole, UserDTO } from "../types"
import User from "./user.model"

@Table({ tableName: "donors" })
export default class Donor extends Model {
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id!: number;

  @BelongsTo(() => User)
  user!: UserDTO;

  @AllowNull(false)
  @Column({ type: DataType.ENUM("LocalBusiness", "IndividualDonor") })
  donor_type!: DonorRole;

  @AllowNull(true) 
  @Column({ type: DataType.STRING })
  facebook_link?: string;

  @AllowNull(true) 
  @Column({ type: DataType.STRING })
  instagram_link?: string;

  @AllowNull(true) 
  @Column({ type: DataType.BOOLEAN })
  recurring_donor?: boolean;

  @AllowNull(true) 
  @Column({ type: DataType.STRING})
  business_name?: string;
}
