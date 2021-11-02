import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import sequelize from "./models";
import nodemailerConfig from "./nodemailer.config";
import authRouter from "./rest/authRoutes";
import donorRouter from "./rest/donorRoutes";
import entityRouter from "./rest/entityRoutes";
import userRouter from "./rest/userRoutes";
import schedulingRouter from "./rest/schedulingRoutes";
import EmailService from "./services/implementations/emailService";
import IEmailService from "./services/interfaces/emailService";

const CORS_ALLOW_LIST = ["http://localhost:3000"];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

const swaggerDocument = YAML.load("swagger.yml");

const app = express();
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/entities", entityRouter);
app.use("/donors", donorRouter);
app.use("/users", userRouter);
app.use("/scheduling", schedulingRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const eraseDatabaseOnSync = false;
sequelize.sync({ force: eraseDatabaseOnSync });

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
});

const emailService: IEmailService = new EmailService(nodemailerConfig);
emailService.checkReminders();

app.listen({ port: 5000 }, () => {
  /* eslint-disable-next-line no-console */
  console.info("Server is listening on port 5000!");
});
