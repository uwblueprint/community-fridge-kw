export type CheckIn = {
  id: string;
  volunteerId?: string | null;
  startDate: string;
  endDate: string;
  notes?: string;
  isAdmin?: boolean;
};

export type UpdatedCheckInFields = Partial<Omit<CheckIn, "id">>;

export type CreateCheckInFields = Omit<CheckIn, "id" | "volunteerId">;
