import {
  Column,
  DataType,
  Model,
  Table,
  AllowNull,
} from "sequelize-typescript";

@Table({ tableName: "content" })
export default class Content extends Model {
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  food_rescue_description!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      isUrl: true,
    },
  })
  food_rescue_url!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  checkin_description!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      isUrl: true,
    },
  })
  checkin_url!: string;
}
