import { BEARER_TOKEN } from "../constants/AuthConstants";
import { Content, UpdateContentDataType } from "../types/ContentTypes";
import baseAPIClient from "./BaseAPIClient";

const getContent = async (): Promise<Content> => {
  try {
    const { data } = await baseAPIClient.get("/content", {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Content;
  }
};

const updateContent = async (
  id: string,
  contentData: UpdateContentDataType,
): Promise<Content> => {
  try {
    const { data } = await baseAPIClient.put(`/content/${id}`, contentData, {
      headers: { Authorization: BEARER_TOKEN },
    });
    return data;
  } catch (error) {
    return error as Content;
  }
};

export default {
  getContent,
  updateContent,
};
