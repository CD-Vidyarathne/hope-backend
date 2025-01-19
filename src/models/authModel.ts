import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./userModel";

@Table({ tableName: "auth" })
export default class Auth extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId!: string;

  @BelongsTo(() => User, { foreignKey: "userId", onDelete: "CASCADE" })
  user!: User;
}
