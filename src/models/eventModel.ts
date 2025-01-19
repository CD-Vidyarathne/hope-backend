import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from "sequelize-typescript";
import { EventStatus } from "../types/enums";
import { generateCustomId } from "../utils/generateId";
import User from "./userModel";
import EventVolunteer from "./eventVolunteerModel";

@Table({ tableName: "events" })
export default class Event extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  organizerId!: string;

  @BelongsTo(() => User)
  organizer!: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  venue!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  time!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(EventStatus)),
    allowNull: false,
  })
  status!: EventStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  eventPicURL!: string;

  @BelongsToMany(() => User, () => EventVolunteer)
  volunteers!: User[];

  @BeforeCreate
  static async generateId(event: Event) {
    event.id = await generateCustomId("Event", "E", event.sequelize);
  }
}
