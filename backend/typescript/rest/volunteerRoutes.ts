import { Router } from "express";
import VolunteerService from "../services/implementations/volunteerService";
import IVolunteerService from "../services/interfaces/volunteerService";
import { UserVolunteerDTO } from "../types";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const volunteerRouter: Router = Router();
const volunteerService: IVolunteerService = new VolunteerService();

volunteerRouter.get("/", async (req, res) => {
  const contentType = req.headers["content-type"];
  try {
    const volunteers = await volunteerService.getVolunteers();
    await sendResponseByMimeType<UserVolunteerDTO>(
      res,
      200,
      contentType,
      volunteers,
    );
  } catch (error: any) {
    await sendResponseByMimeType(res, 500, contentType, [
      {
        error: error.message,
      },
    ]);
  }
});

volunteerRouter.get("/:volunteerID", async (req, res) => {
  const { volunteerID } = req.params;
  const contentType = req.headers["content-type"];

  if (!volunteerID) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by missing volunteerID.",
      },
    ]);
    return;
  }

  if (volunteerID) {
    if (typeof volunteerID !== "string") {
      res
        .status(400)
        .json({ error: "volunteerID query parameter must be a string." });
    } else {
      try {
        const volunteer = await volunteerService.getVolunteerByID(volunteerID);
        res.status(200).json(volunteer);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  }
});

volunteerRouter.put("/:volunteerID", async (req, res) => {
  const { id } = req.query;
});

volunteerRouter.delete("/:volunteerID", async (req, res) => {
  const { volunteerID } = req.params;

  try {
    await volunteerService.deleteVolunteerByID(volunteerID);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default volunteerRouter;
