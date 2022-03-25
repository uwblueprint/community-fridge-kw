export type CheckIn = {
  id: string;
  volunteerId?: number | null;
  startDate: string;
  endDate: string;
  notes?: string;
  isAdmin?: boolean;
};

export type UpdatedCheckInFields = Partial<Omit<CheckIn, "id">>;
