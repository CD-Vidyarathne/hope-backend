import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Roles } from "../types/enums";
import { generateCustomId } from "../utils/generateId";
import User from "./userModel";

@Table({ tableName: "profile_requests" })
export default class ProfileRequest extends Model {
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
  userid!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string;

  @Column({
    type: DataType.ENUM(...Object.values(Roles)),
    allowNull: true,
  })
  role!: Roles;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  dpURL!: string;

  @BelongsTo(() => User)
  organizer!: User;

  @BeforeCreate
  static async generateId(profileRequest: ProfileRequest) {
    profileRequest.id = await generateCustomId(
      "ProfileRequest",
      "PR",
      profileRequest.sequelize,
    );
  }
}
