export type Schedule = {
  id: string;
  donorId: string;
  categories: string[];
  size: string;
  isPickup: boolean | null;
  pickupLocation: string | null;
  dayPart: string;
  startTime: string;
  endTime: string;
  status: string;
  volunteerNeeded: boolean;
  volunteerTime: string | null;
  frequency: string;
  recurringDonationId: string;
  recurringDonationEndDate: string;
  notes: string;
  volunteerId?: number;
};

export type UpdatedSchedulingFields = Partial<Omit<Schedule, "donorId">>;
