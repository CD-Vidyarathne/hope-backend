import { Sequelize } from "sequelize-typescript";
import User from "../models/user";
import Blog from "../models/blog";
import Comment from "../models/comment";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  models: [User, Blog, Comment],
});

export default sequelize;
