import { Subscriber } from "./Subscriber";

export interface MonthlyPayers {
  month: string;
  payers: Subscriber[];
}
