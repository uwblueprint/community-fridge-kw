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
import checkInRouter from "./rest/checkInRoutes";
import contentRouter from "./rest/contentRoutes";
import healthRouter from "./rest/healthRouter";
import cronRouter from "./rest/cronRoutes";

const CORS_ALLOW_LIST: (string | RegExp)[] = ["http://localhost:3000"];
if (process.env.NODE_ENV === "production") {
  CORS_ALLOW_LIST.push(
    "https://communityfridgekw.web.app",
    "https://schedule.communityfridgekw.ca",
  );
} else if (process.env.NODE_ENV === "staging") {
  const clientHost = new RegExp(
    "https://communityfridgekw-staging(--([A-Za-z0-9-])+-[A-Za-z0-9]+)?.web.app",
  );
  CORS_ALLOW_LIST.push(clientHost);
}

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
app.use("/checkin", checkInRouter);
app.use("/content", contentRouter);
app.use("/health", healthRouter);
app.use("/email-reminders", cronRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const eraseDatabaseOnSync = false;
sequelize.sync({ force: eraseDatabaseOnSync });

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
});

const PORT = process.env.PORT || 5000;
app.listen({ port: PORT }, () => {
  /* eslint-disable-next-line no-console */
  console.info(`Server is listening on port ${PORT}!`);
});
