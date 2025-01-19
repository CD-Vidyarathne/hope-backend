import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BelongsToMany,
} from "sequelize-typescript";
import { Gender, Roles } from "../types/enums";
import { generateCustomId } from "../utils/generateId";
import Event from "./eventModel";
import EventVolunteer from "./eventVolunteerModel";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address!: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: false,
  })
  gender!: Gender;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nic!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  birthDate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.ENUM("admin", "patient", "normal"),
    allowNull: false,
  })
  role!: Roles;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  dpURL!: string;

  @BelongsToMany(() => Event, () => EventVolunteer)
  events!: Event[];

  @BeforeCreate
  static async generateId(user: User) {
    user.id = await generateCustomId("User", "U", user.sequelize);
  }
}
