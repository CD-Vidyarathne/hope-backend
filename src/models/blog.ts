import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "./user";
import Comment from "./comment";

@Table({ tableName: "blogs" })
export default class Blog extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

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

  @BelongsTo(() => User)
  author!: User;

  @HasMany(() => Comment)
  comments!: Comment[];
}
