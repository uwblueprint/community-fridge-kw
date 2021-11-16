import { Router } from "express";
import donorDtoValidator from "../middlewares/validators/donorValidator";
import DonorService from "../services/implementations/donorService";
import IDonorService from "../services/interfaces/donorService";
import { UserDonorDTO } from "../types";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const donorRouter: Router = Router();
const donorService: IDonorService = new DonorService();

/* Get all donors and optionally filter by:
  - id, through URI (ex. /scheduling/1)
  - userId, through query param (ex. /scheduling/?userId=1)
*/
donorRouter.get("/:id?", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  const contentType = req.headers["content-type"];

  if (id && userId) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by both id and userId.",
      },
    ]);
    return;
  }

  if (!id && !userId) {
    try {
      const donors = await donorService.getDonors();
      await sendResponseByMimeType(res, 200, contentType, donors);
    } catch (error) {
      await sendResponseByMimeType(res, 500, contentType, [
        {
          error: error.message,
        },
      ]);
    }
    return;
  }

  if (id) {
    if (typeof id !== "string") {
      res.status(400).json({ error: "id query parameter must be a string." });
    } else {
      try {
        const donor = await donorService.getDonorById(id);
        res.status(200).json(donor);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  if (userId) {
    if (typeof userId !== "string") {
      res
        .status(400)
        .json({ error: "userId query parameter must be a string" });
      return;
    }
    try {
      const donor = await donorService.getDonorByUserId(userId);
      res.status(200).json(donor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

/* Update a donor */
donorRouter.put("/:id", donorDtoValidator, async (req, res) => {
  try {
    await donorService.updateDonorById(req.params.id, {
      businessName: req.body.businessName,
      facebookLink: req.body.facebookLink,
      instagramLink: req.body.instagramLink,
    });

    res.status(201).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* Delete a donor */
donorRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await donorService.deleteDonorById(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default donorRouter;
