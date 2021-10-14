import { Router } from "express";
import DonorService from "../services/implementations/donorService";
import IDonorService from "../services/interfaces/donorService";
import { UserDonorDTO, DonorDTO } from "../types";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const donorRouter: Router = Router();
const donorService: IDonorService = new DonorService();

/* Create a donor */
// donorRouter.post()

/* Get all donors */
donorRouter.get("/", async (req, res) => {
  const contentType = req.headers["content-type"];
  try {
    const donors = await donorService.getDonors();
    await sendResponseByMimeType<UserDonorDTO>(res, 200, contentType, donors);
  } catch (error) {
    await sendResponseByMimeType(res, 500, contentType, [
      {
        error: error.message,
      },
    ]);
  }
  return;
});

/* Get donor by ID */
donorRouter.get("/:donorId", async (req, res) => {
  const { donorId } = req.params;
  const contentType = req.headers["content-type"];


  if (!donorId) {
    await sendResponseByMimeType(res, 400, contentType, [
      {
        error: "Cannot query by missing donorId.",
      },
    ]);
    return;
  }

  if (donorId) {
    if (typeof donorId !== "string") {
      res
        .status(400)
        .json({ error: "donorId query parameter must be a string." });
    } else {
      try {
        const donor = await donorService.getDonorById(donorId);
        res.status(200).json(donor);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
    return;
  }
});

/* Update a donor */
donorRouter.put("/:donorId", async (req, res) => {
  try {
    const updatedDonor = await donorService.updateDonorById(
      req.params.donorId,
      {
        donorId: req.body.donorId,
        donorType: req.body.donorType,
        facebookLink: req.body.facebookLink,
        instagramLink: req.body.instagramLink,
        recurringDonor: req.body.recurringDonor,
        businessName: req.body.businessName,
      },
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/* Delete a donor */
donorRouter.delete("/:donorId", async (req, res) => {
  const { donorId } = req.params;

  try {
    await donorService.deleteDonorById(donorId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default donorRouter;
