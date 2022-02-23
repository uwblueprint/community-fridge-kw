import { Router } from "express";

import ICheckInService from "../services/interfaces/checkInService";
import CheckInService from "../services/implementations/checkInService";

const checkInRouter: Router = Router();

const checkInService: ICheckInService = new CheckInService();

checkInRouter.delete("/:id?", async (req, res) => {
    const { id } = req.params;
    res.status(204).send();
})

export default checkInRouter;