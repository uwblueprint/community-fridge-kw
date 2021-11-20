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
  volunteerTime: string;
  frequency: string;
  recurringDonationId: string;
  recurringEndDate: string;
  notes: string;
} | null;

export type UpdatedSchedulingFields = Partial<Omit<Schedule, "donorId">>;
