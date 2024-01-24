import { Subscriber } from "./Subscriber";

export interface MonthlyPayers {
  yearMonth: string;
  payers: Subscriber[];
}
