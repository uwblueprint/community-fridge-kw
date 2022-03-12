export type Content = {
  id: string;
  foodRescueDescription: string;
  foodRescueUrl: string;
  checkinDescription: string;
  checkinUrl: string;
};

export type UpdateContentDataType = Omit<Content, "id">;
