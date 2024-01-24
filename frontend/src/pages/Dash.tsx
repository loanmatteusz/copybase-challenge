import React from "react";
import { BarChart } from "../components/BarChart";
import { Card, Group } from "@mantine/core";


export interface MrrByMonth {
  month: string;
  totalMonthlyMrr: number;
}

export const Dash: React.FC<{ data: MrrByMonth[] }> = ({ data }) => {
  console.log({ data });
  const labels = data.map(mrr => mrr.month);
  const mrrData = data.map(mrr => mrr.totalMonthlyMrr);

  return (
    <>
      <h1>Dashboard</h1>
      <Group>
        <Card>
          Teste
          </Card>
        <Card>
          Teste
          </Card>
        <Card>
          Teste
          </Card>
        <Card>
          Teste
          </Card>
      </Group>
      <BarChart data={mrrData} labels={labels} />
    </>
  );
}
