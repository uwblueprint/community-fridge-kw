import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import sequelize from "./models";
import authRouter from "./rest/authRoutes";
import donorRouter from "./rest/donorRoutes";
import userRouter from "./rest/userRoutes";
import volunteerRouter from "./rest/volunteerRoutes";
import schedulingRouter from "./rest/schedulingRoutes";
import EmailService from "./services/implementations/emailService";
import IEmailService from "./services/interfaces/emailService";

const clientHost = new RegExp(
  "https://communityfridgekw(--([A-Za-z0-9-])+-[A-Za-z0-9]+)?.web.app",
);
const CORS_ALLOW_LIST = ["http://localhost:3000", clientHost];

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
app.use("/donors", donorRouter);
app.use("/users", userRouter);
app.use("/volunteers", volunteerRouter);
app.use("/scheduling", schedulingRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const eraseDatabaseOnSync = false;
sequelize.sync({ force: eraseDatabaseOnSync });

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
});
/*
if (process.env.NODE_ENV === "production") {
  const emailService: IEmailService = new EmailService(nodemailerConfig);
  emailService.checkReminders();
}
*/
const PORT = process.env.PORT || 5000;
app.listen({ port: PORT }, () => {
  /* eslint-disable-next-line no-console */
  console.info(`Server is listening on port ${PORT}!`);
});
