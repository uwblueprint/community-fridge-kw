import { Router } from "express";
import ContentService from "../services/implementations/contentService";
import IContentService from "../services/interfaces/contentService";
import getErrorMessage from "../utilities/errorMessageUtil";
import { sendResponseByMimeType } from "../utilities/responseUtil";
import contentDtoValidator from "../middlewares/validators/contentValidators";

const contentRouter: Router = Router();
const contentService: IContentService = new ContentService();

contentRouter.post("/", async (req, res) => {
  try {
    const newContent = await contentService.createContent({
      ...req.body,
    });
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

contentRouter.get("/", async (req, res) => {
  const contentType = req.headers["content-type"];

  try {
    const contents = await contentService.getContent();
    await sendResponseByMimeType(res, 200, contentType, contents);
  } catch (error) {
    await sendResponseByMimeType(res, 500, contentType, [
      {
        error: getErrorMessage(error),
      },
    ]);
  }
});

contentRouter.put("/:id", contentDtoValidator, async (req, res) => {
  try {
    const updatedContent = await contentService.updateContent(req.params.id, {
      ...req.body,
    });
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default contentRouter;
