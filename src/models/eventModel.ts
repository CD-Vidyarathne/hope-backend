import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  BelongsTo,
  ForeignKey,
  HasMany,
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
  eventName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  purpose!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  venue!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  time!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  eventPicURL!: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  committeeEmails!: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  participantsExpected!: number;

  @Column({
    type: DataType.ENUM(...Object.values(EventStatus)),
    allowNull: false,
    defaultValue: EventStatus.PENDING,
  })
  status!: EventStatus;

  @HasMany(() => EventVolunteer)
  volunteers!: EventVolunteer[];

  @BeforeCreate
  static async generateId(event: Event) {
    console.log("Is this working");
    event.id = await generateCustomId("Event", "E", event.sequelize);
  }
}
