import { snakeCase } from "lodash";
import Content from "../../../models/content.model";
import ContentService from "../contentService";

import testSql from "../../../testUtils/testDb";

const mockContentData = {
  foodRescueDescription: "test food rescue description",
  foodRescueUrl: "uwblueprint.org",
  checkinDescription: "test checkin description",
  checkinUrl: "testurl.com",
};

const mockUpdateContentData = {
  foodRescueDescription: "update test food rescue description",
  foodRescueUrl: "update.uwblueprint.org",
  checkinDescription: "update test checkin description",
  checkinUrl: "update.testurl.com",
};

describe("Testing ContentService functions", () => {
  let contentService: ContentService;

  beforeEach(async () => {
    await testSql.sync({ force: true });
    contentService = new ContentService();
  });

  afterAll(async () => {
    await testSql.sync({ force: true });
    await testSql.close();
  });

  it("testing createContent", async () => {
    const result = await contentService.createContent(mockContentData);
    expect(result).toMatchObject({
      id: "1",
      ...mockContentData,
    });
  });

  it("testing updateContent", async () => {
    await Content.create({
      food_rescue_description: mockContentData.foodRescueDescription,
      food_rescue_url: mockContentData.foodRescueUrl,
      checkin_description: mockContentData.checkinDescription,
      checkin_url: mockContentData.checkinUrl,
    });
    const result = await contentService.updateContent(
      "1",
      mockUpdateContentData,
    );
    expect(result).toMatchObject({
      id: "1",
      ...mockUpdateContentData,
    });
  });

  it("testing getContent", async () => {
    await Content.create({
      food_rescue_description: mockContentData.foodRescueDescription,
      food_rescue_url: mockContentData.foodRescueUrl,
      checkin_description: mockContentData.checkinDescription,
      checkin_url: mockContentData.checkinUrl,
    });
    const result = await contentService.getContent();
    expect(result).toMatchObject({
      id: "1",
      ...mockContentData,
    });
  });
});
