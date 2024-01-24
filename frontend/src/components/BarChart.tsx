import React, { useEffect, useRef, useState } from "react";
import Chart from 'chart.js/auto';

export const BarChart: React.FC<{ data: number[], labels: string[] }> = ({ data, labels }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [chart, setChart] = useState<Chart>();

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
            },
            plugins: {
              legend: {
                onClick: () => {}, // Desativa a ação de clique na legenda
              },
            },
          },
        });

        setChart(barChart);

        return () => {
          barChart.destroy();
        };
      }
    }
  }, [data, labels]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (chart) {
        chart.resize();
      }
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [chart]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: 'auto' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
