import { Sequelize } from "sequelize-typescript";
import User from "../models/userModel";
import Event from "../models/eventModel";
import Request from "../models/requestModel";
import Donation from "../models/donationModel";
import Auth from "../models/authModel";
import EventVolunteer from "../models/eventVolunteerModel";
import ProfileRequest from "../models/profileReqModel";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  logging: false,
  models: [
    User,
    Event,
    Request,
    Donation,
    Auth,
    EventVolunteer,
    ProfileRequest,
  ],
});

export default sequelize;
