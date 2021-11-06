export type Schedule = {
  donorId: number;
  category: string;
  quantity: number;
  size: string;
  pickupLocation: string;
  startTime: Date;
  endTime: Date;
  status: "Approved" | "Pending" | "Rejected";
  volunteersNeeded: number;
  notes: string;
} | null;

export type UpdatedSchedulingFields = Partial<Omit<Schedule, "donorId">>;
