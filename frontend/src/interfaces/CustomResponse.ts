export interface MrrByMonth {
  yearMonth: string;
  newPayers: number;
  totalMonthlyMrr: number;
}

export interface CustomResponse {
  totalMrr: number;
  newMrrValue: number;
  churnMrrValue: number;
  payersByMonth: MrrByMonth[];
}
