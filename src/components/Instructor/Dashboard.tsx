import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Chart, ChartContent } from "@/components/ui/chart";

const earningsData = [
  { month: "Jan", earnings: 500 },
  { month: "Feb", earnings: 800 },
  { month: "Mar", earnings: 1200 },
  { month: "Apr", earnings: 1000 },
  { month: "May", earnings: 1250 },
  { month: "Jun", earnings: 1200 },
  { month: "Jul", earnings: 800 },
  { month: "Aug", earnings: 600 },
  { month: "Sep", earnings: 1000 },
  { month: "Oct", earnings: 1250 },
  { month: "Nov", earnings: 800 },
  { month: "Dec", earnings: 1500 },
];
const totalEarnings = earningsData.reduce(
  (sum, item) => sum + item.earnings,
  0
);
const averageEarnings =
  Math.round(totalEarnings / earningsData.length / 10) * 10;

const dummyStats = {
  totalCourses: 5,
  totalStudents: 320,
  averageRating: 4.6,
  averageMonthlyEarnings: averageEarnings,
};

interface ManageCoursesProps {
  instructorData: { total_courses: number; total_students: number };
  onGoToCourses: () => void; // Callback to switch to create course view
  onGoToStudents: () => void; // Callback to switch to create course view
}

const Dashboard: React.FC<ManageCoursesProps> = ({
  instructorData,
  onGoToCourses,
  onGoToStudents,
}) => {
  const [animatedData, setAnimatedData] = useState(
    earningsData.map((item) => ({ ...item, earnings: 0 }))
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedData(earningsData);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-900 flex flex-col justify-between">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <Card>
          <CardContent className="p-4 cursor-pointer" onClick={onGoToCourses}>
            <p className="text-white text-sm">Total Courses</p>
            <h2 className="text-xl font-bold">
              {instructorData.total_courses}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 cursor-pointer" onClick={onGoToStudents}>
            <p className=" text-sm">Total Students</p>
            <h2 className="text-xl font-bold">
              {instructorData.total_students}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className=" text-sm">Average Rating</p>
            <h2 className="text-xl font-bold">{dummyStats.averageRating}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className=" text-sm">Monthly Earnings</p>
            <h2 className="text-xl font-bold">
              ${dummyStats.averageMonthlyEarnings}
            </h2>
          </CardContent>
        </Card>

        {/* Earnings Chart */}
        <Chart className="col-span-2 md:col-span-4">
          <ChartContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Earnings Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={animatedData} // or earningsData if not animating
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" domain={[0, "dataMax + 200"]} />
                <Tooltip />

                {/* Line on top of the area */}
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContent>
        </Chart>
        <Card>
          <CardContent>
            <p className="text-sm">Highest Earning Month</p>
            <h2 className="text-xl font-bold">
              {
                earningsData.reduce((max, item) =>
                  item.earnings > max.earnings ? item : max
                ).month
              }
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm">Lowest Earning Month</p>
            <h2 className="text-xl font-bold">
              {
                earningsData.reduce((min, item) =>
                  item.earnings < min.earnings ? item : min
                ).month
              }
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm">Total Earnings</p>
            <h2 className="text-xl font-bold">${totalEarnings}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm">Earnings Variance</p>
            <h2 className="text-xl font-bold">$200</h2>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto mt-12 text-center italic text-gray-600">
        “Success usually comes to those who are too busy to be looking for it.”
        - Henry David Thoreau
      </div>
    </div>
  );
};
export default Dashboard;
