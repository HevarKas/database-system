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
  BarChart,
  Bar,
  Legend,
  Rectangle,
} from 'recharts';
import { getReports, getReportsByTimeRange } from '~/api/endpoints/reports';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { getDateRange } from '~/lib/general';
import { incomeDataType, reportDataType, timeRangeType } from '~/shared/types/pages/dashboard';
import { useTranslation } from 'react-i18next';

export const loader = async ({ request }: { request: Request }) => {
  const reportData = await getReports(request);

  const url = new URL(request.url);
  const timeRange = url.searchParams.get('timeRange') || 'day';

  const { from, to } = getDateRange(timeRange);

  const incomeData = await getReportsByTimeRange(request, from, to);

  return { 
    reportData,
    incomeData,
    timeRange,
  };
};

function Dashboard() {
  const { t } = useTranslation();
  const { reportData, incomeData, timeRange }: 
  { reportData: reportDataType, incomeData: incomeDataType, timeRange: timeRangeType } 
  = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTimeRange = searchParams.get('timeRange') || timeRange;

  const handleTimeRangeChange = (range: string) => {
    setSearchParams({ timeRange: range });
  };

  const transformedData  = [
    { name: t('dashboard.completedOrders.today'), pv: reportData.orders_today || 0 },
    { name: t('dashboard.completedOrders.average'), uv: 50},
  ];

  const pieDataReport = reportData.categories_with_most_books_in_stock.map((category) => ({
    name: category.name,
    value: category.books_count,
  }));

  const transformedAreaData = [
    { name: t('dashboard.income.totalIncome'), income: incomeData.total },
    { name: t('dashboard.income.paid'), income: incomeData.paid },  
    { name: t('dashboard.income.amountDue'), income: incomeData.amount_due },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', "#EE82EE"]

  return (
    <section className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {t('dashboard.newBooks')}
          </h3>
          <p className="text-2xl font-bold">
            {reportData.books_added_in_last_2_weeks || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {t('dashboard.orderToday')}
          </h3>
          <p className="text-2xl font-bold">
          {reportData.orders_today || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {t('dashboard.differentCategories')}
          </h3>
          <p className="text-2xl font-bold">
          {reportData.total_categories || 0}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {t('dashboard.totalBooks')}
          </h3>
          <p className="text-2xl font-bold">
          {reportData.total_books || 0}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {t('dashboard.mostBookInCategory')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieDataReport}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieDataReport.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value}`, `${name}`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {t('dashboard.completedOrders.name')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={300}
              data={transformedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
              <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {t('dashboard.income.name')}
          </h3>
          <div className="w-32">
            <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder={selectedTimeRange} />
              </SelectTrigger>
              <SelectContent>
                {['day', 'week', 'month', 'year'].map((item) => (
                  <SelectItem key={item} value={item}>
                    {t(`dashboard.selectDate.${item}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={transformedAreaData}
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
