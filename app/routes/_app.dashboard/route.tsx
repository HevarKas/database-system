import { useState } from 'react';
import { Card } from '~/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function Dashboard() {
  const [timeRange, setTimeRange] = useState('day');

  // Dummy data for charts
  const pieData = [
    { name: 'Fiction', value: 400 },
    { name: 'Non-Fiction', value: 300 },
    { name: 'Science', value: 300 },
    { name: 'History', value: 200 },
  ];

  const areaData = [
    { name: '2024-08-01', income: 2400 },
    { name: '2024-08-02', income: 2210 },
    { name: '2024-08-03', income: 2290 },
    // ... more data
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <section className="space-y-6 p-6">
      {/* Top Row: Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            Most New Books (Last 2 Weeks)
          </h3>
          <p className="text-4xl font-bold">25</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Orders Today</h3>
          <p className="text-4xl font-bold">120</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Different Categories</h3>
          <p className="text-4xl font-bold">15</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Total Books</h3>
          <p className="text-4xl font-bold">450</p>
        </Card>
      </div>

      {/* Second Row: Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Most Sold Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Most books in stock by category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Third Row: Area Chart */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Income in the last 30 days</h3>
          <div className="w-32">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={timeRange} />
              </SelectTrigger>
              <SelectContent>
                {['day', 'week', 'month', 'year'].map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    onClick={() => setTimeRange(item)}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={areaData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </section>
  );
}

export default Dashboard;
