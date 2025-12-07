"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!Array.isArray(assessments) || assessments.length === 0) {
      setChartData([]);
      return;
    }

    // sort oldest -> newest and ensure numeric scores
    const sorted = [...assessments].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    const formattedData = sorted.map((assessment) => ({
      // include a unique timestamp to avoid duplicate x values
      date: format(new Date(assessment.createdAt), "MMM dd, HH:mm:ss"),
      // force numeric score
      score: Number(assessment.quizScore) || 0,
      // keep original id or createdAt for debugging/keys
      id: assessment.id ?? assessment.createdAt,
    }));

    console.log("PerformanceChart - formattedData:", formattedData);

    // ensure new array reference
    setChartData([...formattedData]);
  }, [assessments]);

  // derive a key so React remounts the chart whenever scores change
  const chartKey =
    chartData.length > 0 ? chartData.map((d) => `${d.id}-${d.score}`).join("|") : "empty";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {/* key forces a full remount when chart data changes */}
            <LineChart key={chartKey} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                // key here also helps if you ever need to force the tooltip to recreate
                key={`tooltip-${chartData.length}`}
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    // prefer payload[0].payload.score for reliability
                    const payloadScore =
                      payload[0]?.payload?.score ?? payload[0]?.value ?? 0;
                    const payloadDate = payload[0]?.payload?.date ?? "";
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="text-sm font-medium">Score: {payloadScore}%</p>
                        <p className="text-xs text-muted-foreground">{payloadDate}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="blue"
                strokeWidth={3}
                dot={{ r: 5 }}
                // disable animation so tooltip reads exact values immediately
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
