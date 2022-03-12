import { ContentDTO, CreateContentDTO, UpdateContentDTO } from "../../types";

interface IContentService {
  /**
   * Create content description and url's for food rescue and checkins
   * @param content a ContentDTO with the content information
   * @returns a ContentDTO with the content information
   * @throws Error if creation fails
   */
  createContent(content: CreateContentDTO): Promise<ContentDTO>;

  /**
   * Get content description and url's for food rescue and checkins
   * @returns a ContentDTO with the content information
   * @throws Error if getting content fails
   */
  getContent(): Promise<ContentDTO>;

  /**
   * Get content description and url's for food rescue and checkins
   * @param id which is always 1 to retrieve the first entry
   * @throws Error if updating content fails
   */
  updateContent(id: string, content: UpdateContentDTO): Promise<ContentDTO>;
}

export default IContentService;
