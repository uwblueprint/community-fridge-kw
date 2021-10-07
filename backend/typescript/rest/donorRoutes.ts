import { Router } from "express";
import DonorService from "../services/implementations/donorService";
import IDonorService from "../services/interfaces/donorService";
import { DonorDTO } from "../types";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const donorRouter: Router = Router();

const donorService: IDonorService = new DonorService();


/* Create a donor */
// donorRouter.post()

/* Get all donors */
donorRouter.get("/", async (req, res) => {
  const { userId } = req.query;
  const contentType = req.headers["content-type"];
  try {
    const users = await donorService.getDonors();
    await sendResponseByMimeType<DonorDTO>(res, 200, contentType, users);
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
donorRouter.get("/:id", async (req, res) => {

  // if (!userId) {
  //   try {
  //     const users = await donorService.getDonors();
  //     await sendResponseByMimeType<DonorDTO>(res, 200, contentType, users);
  //   } catch (error) {
  //     await sendResponseByMimeType(res, 500, contentType, [
  //       {
  //         error: error.message,
  //       },
  //     ]);
  //   }
  //   return;
  // }

  // if (userId) {
  //   if (typeof userId !== "string") {
  //     res
  //       .status(400)
  //       .json({ error: "userId query parameter must be a string." });
  //   } else {
  //     try {
  //       const user = await donorService.getUserById(userId);
  //       res.status(200).json(user);
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   }
  //   return;
  // }

});

/* Update a donor */
donorRouter.put("/:donorId", async (req, res) => {
  try {
    const updatedDonor = await donorService.updateDonorById(req.params.donorId, {
      donorId: req.body.donorId,
      donorType: req.body.donorType,
      facebookLink: req.body.facebookLink,
      instagramLink: req.body.instagramLink,
      recurringDonor: req.body.recurringDonor,
      businessName: req.body.businessName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Delete a donor */
donorRouter.delete("/:donorId", async (req, res) => {
  const { donorId } = req.params;

  try {
    await donorService.deleteDonorById(donorId);
    res.status(204).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default donorRouter;