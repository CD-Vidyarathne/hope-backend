import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "./utils/logger";
import requestLogger from "./middlewares/requestLogger";
import sequelize from "./config/db";
import helmet from "helmet";
import AuthRoutes from "./routes/authRoutes";
import UserRoutes from "./routes/userRoutes";
import RequestRoutes from "./routes/requestRoutes";
import DonationRoutes from "./routes/donationRoutes";
import EventRoutes from "./routes/eventRoutes";
import DashboardRoutes from "./routes/dashboardRoutes";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({ xssFilter: true }));
app.use(requestLogger);
app.use("/api/auth/", AuthRoutes);
app.use("/api/users/", UserRoutes);
app.use("/api/requests/", RequestRoutes);
app.use("/api/donations/", DonationRoutes);
app.use("/api/events/", EventRoutes);
app.use("/api/dashboard/", DashboardRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to the Hope API");
});

sequelize
  .sync({ force: false })
  .then(() => {
    logger.info("Database synchronized successfully.");
  })
  .catch((err) => {
    logger.error("Error synchronizing database:", err);
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
