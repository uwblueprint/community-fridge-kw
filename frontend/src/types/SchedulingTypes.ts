export type Schedule = {
  id: string;
  donorId: string;
  categories: string[];
  size: string;
  isPickup: boolean;
  pickupLocation: string;
  dayPart: string;
  startTime: string;
  endTime: string;
  status: string;
  volunteerNeeded: boolean;
  volunteerTime: string;
  frequency: string;
  recurringDonationId: string;
  recurringDonationEndDate: string;
  notes: string;
};

export type UpdatedSchedulingFields = Partial<Omit<Schedule, "donorId">>;
