import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import Blog from "./blog";
import Comment from "./comment";
import { Roles } from "../types/roles";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ENUM("user", "moderator", "admin"),
    defaultValue: "user",
  })
  role!: Roles;

  @HasMany(() => Blog)
  blogs!: Blog[];

  @HasMany(() => Comment)
  comments!: Comment[];
}
