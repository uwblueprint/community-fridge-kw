import { Router } from "express";
import getErrorMessage from "../utilities/errorMessageUtil";

const healthRouter: Router = Router();

/* Get all volunteers and optionally filter by:
  - volunteerId, through URI (ex. /volunteer/1)
  - userId, through query param (ex. /volunteer/?userId=1)
*/
healthRouter.get("/", async (req, res) => {
  try {
    res.status(200).json({ res: "Health OK" });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default healthRouter;
