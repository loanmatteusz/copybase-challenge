import React, { useEffect, useRef } from "react";
import Chart from 'chart.js/auto';

export const BarChart: React.FC<{ data: number[], labels: string[] }> = ({ data, labels }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'MRR',
              data: data,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              }
            }
          },
        });

        return () => {
          barChart.destroy();
        };
      }
    }
  }, [data, labels]);

  return (
    <>
      <canvas ref={chartRef} width="1200" height="600"></canvas>
    </>
  );
}
