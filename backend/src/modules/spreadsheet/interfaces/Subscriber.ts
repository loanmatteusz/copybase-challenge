export interface Subscriber {
  id: number;
  name: string;
  register_date: Date;
  cancel_date?: Date;
  plan_type: string;
  payment: number;
}
