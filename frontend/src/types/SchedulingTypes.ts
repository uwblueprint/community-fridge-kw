export type Schedule = {
  donorId: number;
  category: string[];
  quantity: number;
  size: string;
  isPickup: boolean;
  pickupLocation: string;
  startTime: Date;
  endTime: Date;
  status: "Approved" | "Pending" | "Rejected";
  volunteersNeeded: boolean;
  frequency: string;
  notes: string;
} | null;

export type UpdatedSchedulingFields = Partial<Omit<Schedule, "donorId">>;
