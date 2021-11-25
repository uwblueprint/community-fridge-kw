export type Schedule = {
  id: string;
  donorId: string;
  categories: string[];
  size: string;
  isPickup: boolean;
  pickupLocation: string;
  daypart: string;
  startTime: string;
  endTime: string;
  status: string;
  volunteerNeeded: boolean;
  frequency: string;
  notes: string;
} | null;

export type UpdatedSchedulingFields = Partial<Omit<Schedule, "donorId">>;
