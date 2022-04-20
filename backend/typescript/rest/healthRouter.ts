import { Router } from "express";
import getErrorMessage from "../utilities/errorMessageUtil";

const healthRouter: Router = Router();

/*
Health endpoint for the pinger to hit to keep the server running
*/
healthRouter.get("/", async (req, res) => {
  try {
    res.status(200).json({ res: "Health OK" });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default healthRouter;
