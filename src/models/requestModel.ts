import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  BeforeCreate,
  AllowNull,
} from "sequelize-typescript";
import User from "./userModel";
import { generateCustomId } from "../utils/generateId";
import { DonationType, RequestStatus, RequestType } from "../types/enums";

@Table({ tableName: "requests" })
export default class Request extends Model {
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
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.ENUM(...Object.values(RequestType)),
    allowNull: false,
  })
  requestType!: RequestType;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  neededAmount!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
  })
  currentlyFilled!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reason!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.ENUM(...Object.values(RequestStatus)),
    allowNull: false,
    defaultValue: RequestStatus.PENDING,
  })
  status!: RequestStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(DonationType)),
    allowNull: false,
  })
  donationType!: DonationType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  documentURL!: string;

  @BeforeCreate
  static async generateId(request: Request) {
    console.log("is this happenning");
    request.id = await generateCustomId("Request", "R", request.sequelize);
  }
}
