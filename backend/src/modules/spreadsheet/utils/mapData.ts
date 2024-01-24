import { FileTitles, Subscriber } from "../interfaces/Subscriber";

export function mapData(fileData: FileTitles[]): Subscriber[] {
  return fileData.map(data => {
    const subscriber: Subscriber = {
      id: data["ID assinante"],
      register_date: new Date(data["data início"]),
      plan_type: String(data["cobrada a cada X dias"]),
      payment: parseFloat(data["valor"]), // Converte a string para número
      cancel_date: data["data cancelamento"] ? new Date(data["data cancelamento"]) : null,
      status: data["status"],
      status_date: new Date(data["data status"]),
      next_cycle: new Date(data["próximo ciclo"])
    };

    return subscriber;
  });
}
