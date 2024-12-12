import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./user";
import Blog from "./blog";

@Table({ tableName: "comments" })
export default class Comment extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  timestamp!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userid!: number;

  @ForeignKey(() => Blog)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  blogid!: number;

  @BelongsTo(() => User)
  author!: User;

  @BelongsTo(() => Blog)
  blog!: Blog;
}
