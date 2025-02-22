import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  BeforeCreate,
} from "sequelize-typescript";
import User from "./userModel";
import Request from "./requestModel";
import { generateCustomId } from "../utils/generateId";

@Table({ tableName: "donations" })
export default class Donation extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromUserId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toUserId!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @ForeignKey(() => Request)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  requestId!: string;

  @BelongsTo(() => User, { foreignKey: "fromUserId" })
  fromUser!: User;

  @BelongsTo(() => User, { foreignKey: "toUserId" })
  toUser!: User;

  @BelongsTo(() => Request, { foreignKey: "requestId" })
  request!: Request;

  @BeforeCreate
  static async generateId(donation: Donation) {
    donation.id = await generateCustomId("Donation", "D", donation.sequelize); // "D" is the prefix for Donation IDs
  }
}
