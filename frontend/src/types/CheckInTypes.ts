export type CheckIn = {
  id: string;
  volunteerId?: number | null;
  startDate: string;
  endDate: string;
  notes?: string;
  isAdmin?: boolean;
};

export type UpdatedCheckInFields = Partial<Omit<CheckIn, "id">>;

export type CreateCheckInFields = Omit<CheckIn, "id" | "volunteerId">;

export type UpdateCheckInFields = Omit<CheckIn, "id" | "volunteerId" | "isAdmin">;
