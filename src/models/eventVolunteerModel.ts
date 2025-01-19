import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import Event from "./eventModel";
import User from "./userModel";

@Table({ tableName: "event_volunteers" })
export default class EventVolunteer extends Model {
  @ForeignKey(() => Event)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  eventId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId!: string;
}
