export interface Subscriber {
  id?: string;
  register_date?: Date;
  cancel_date?: Date;
  plan_type?: string;
  payment?: number;

  status?: string;
  status_date?: Date;
  next_cycle?: Date;
  billing_amount?: number;
}

export interface FileTitles {
  "quantidade cobranças": string;
  "cobrada a cada X dias": string;
  "data início": string;
  "status": string;
  "data status": string;
  "data cancelamento"?: string;
  "valor": string;
  "próximo ciclo": string;
  "ID assinante": string;
}
