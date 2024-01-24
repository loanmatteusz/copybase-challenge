export interface MrrByMonth {
  month: string;
  totalMonthlyMrr: number;
}

export interface CustomResponse {
  totalMrr: number;
  newMrr: number;
  churnMrr: number;
  mrrByMonth: MrrByMonth[];
}
