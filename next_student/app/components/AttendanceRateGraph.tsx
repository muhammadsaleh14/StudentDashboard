"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AverageAttendance } from "@/app/interfaces/models";

export const description = "A multiple bar chart";

//{course,atendance}

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  average_attendance: {
    label: "Average Attendance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface AverageAttendanceProps {
  data: AverageAttendance[]; // Array of average attendance data
}

const AttendanceRateGraph: React.FC<AverageAttendanceProps> = ({ data }) => {
  return (
    <Card className="flex flex-col flex-grow m-5">
      <CardHeader>
        <CardTitle>Average Attendance per Course</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="p-0 flex-grow ">
        <ChartContainer config={chartConfig} className="h-full">
          <BarChart accessibilityLayer data={data} className="m-0">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="average_attendance"
              fill={chartConfig.average_attendance.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default AttendanceRateGraph;
