"use client";

import { PieChart, Pie, Cell, Customized } from "recharts";

interface PercentagePieChartProps {
  value: number; // percentage (0–100)
  className?: string;
  fillColor?: string; // optional, default "#4f46e5"
  emptyColor?: string; // optional, default "#e5e7eb"
}

export default function PercentagePieChart({
  value,
  className,
  fillColor = "var(--color-primary)",
  emptyColor = "var(--color-text-muted)",
}: PercentagePieChartProps) {
  const data = [
    { name: "Filled", value },
    { name: "Empty", value: 100 - value },
  ];

  return (
    <>
      <PieChart width={"100%"} height={"100%"} className={className}>
        <Pie
          data={data}
          dataKey="value"
          startAngle={-90} // ⬅️ start from bottom
          endAngle={-450} // ⬅️ fill clockwise
          innerRadius="80%"
          outerRadius="100%"
          stroke="none"
        >
          {/* <Cell key="filled" fill={fillColor} /> */}
          <Cell key="filled" fill={fillColor} />

          <Cell key="empty" fill={emptyColor} />
        </Pie>
      </PieChart>
    </>
  );
}
