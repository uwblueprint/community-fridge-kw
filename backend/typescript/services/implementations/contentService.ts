import { ContentDTO, CreateContentDTO, UpdateContentDTO } from "../../types";
import IContentService from "../interfaces/contentService";
import logger from "../../utilities/logger";
import Content from "../../models/content.model";
import getErrorMessage from "../../utilities/errorMessageUtil";

const Logger = logger(__filename);

class ContentService implements IContentService {
  /* eslint-disable class-methods-use-this */
  async createContent(content: CreateContentDTO): Promise<ContentDTO> {
    let newContent: Content;

    try {
      newContent = await Content.create({
        food_rescue_description: content.foodRescueDescription,
        food_rescue_url: content.foodRescueUrl,
        checkin_description: content.checkinDescription,
        checkin_url: content.checkinUrl,
      });
    } catch (error) {
      Logger.error(
        `Failed to create content copy. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(newContent.id),
      foodRescueDescription: newContent.food_rescue_description,
      foodRescueUrl: newContent.food_rescue_url,
      checkinDescription: newContent.checkin_description,
      checkinUrl: newContent.checkin_url,
    };
  }

  /* eslint-disable class-methods-use-this */
  async getContent(): Promise<ContentDTO> {
    let contentDto: ContentDTO | null;

    try {
      const contentResponse = await Content.findOne({
        where: { id: 1 },
      });

      if (!contentResponse) {
        throw new Error(`No content was found.`);
      }
      contentDto = {
        id: String(contentResponse.id),
        foodRescueDescription: contentResponse.food_rescue_description,
        foodRescueUrl: contentResponse.food_rescue_url,
        checkinDescription: contentResponse.checkin_description,
        checkinUrl: contentResponse.checkin_url,
      };
    } catch (error) {
      Logger.error(`Failed to get content. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return contentDto;
  }

  /* eslint-disable class-methods-use-this */
  async updateContent(
    id: string,
    content: UpdateContentDTO,
  ): Promise<ContentDTO> {
    let updateResult: ContentDTO;
    try {
      const response = await Content.update(
        {
          food_rescue_description: content.foodRescueDescription,
          food_rescue_url: content.foodRescueUrl,
          checkin_description: content.checkinDescription,
          checkin_url: content.checkinUrl,
        },
        {
          where: { id },
          limit: 1,
          returning: true,
        },
      );

      updateResult = {
        id: String(response[1][0].id),
        foodRescueDescription: response[1][0].food_rescue_description,
        foodRescueUrl: response[1][0].food_rescue_url,
        checkinDescription: response[1][0].checkin_description,
        checkinUrl: response[1][0].checkin_url,
      };
    } catch (error) {
      Logger.error(
        `Failed to update content. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return updateResult;
  }
}

export default ContentService;
