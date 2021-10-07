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
  try {
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
    



  }
  catch {

  }
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
donorRouter.put("/:id", async (req, res) => {

});

/* Delete a donor */
donorRouter.delete("/:id", async (req, res) => {

});

export default donorRouter;