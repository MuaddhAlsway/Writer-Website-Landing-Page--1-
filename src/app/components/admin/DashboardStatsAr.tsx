import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardStatsArProps {
  stats: {
    totalSubscribers: number;
    activeSubscribers: number;
    monthlyStats: Array<{ month: string; count: number }>;
  };
  onRefresh: () => void;
}

export function DashboardStatsAr({ stats, onRefresh }: DashboardStatsArProps) {
  // Format month data for charts
  const chartData = stats.monthlyStats.map((stat) => ({
    month: new Date(stat.month + '-01').toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' }),
    subscribers: stat.count,
  }));

  // Calculate cumulative data
  let cumulative = 0;
  const cumulativeData = stats.monthlyStats.map((stat) => {
    cumulative += stat.count;
    return {
      month: new Date(stat.month + '-01').toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' }),
      total: cumulative,
    };
  });

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-900">نظرة عامة على التحليلات</h2>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      {/* Monthly Signups Chart */}
      <Card className="p-6 bg-white shadow-lg">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">الاشتراكات الشهرية</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="subscribers" fill="#78716c" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Cumulative Growth Chart */}
      <Card className="p-6 bg-white shadow-lg">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">النمو التراكمي</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#78716c" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly Breakdown Table */}
      <Card className="p-6 bg-white shadow-lg">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">تفصيل شهري</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-right py-3 px-4 text-stone-700 font-semibold">الشهر</th>
                <th className="text-right py-3 px-4 text-stone-700 font-semibold">مشتركون جدد</th>
                <th className="text-right py-3 px-4 text-stone-700 font-semibold">الإجمالي التراكمي</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthlyStats.map((stat, index) => {
                const cumulativeTotal = stats.monthlyStats
                  .slice(0, index + 1)
                  .reduce((sum, s) => sum + s.count, 0);
                
                return (
                  <tr key={stat.month} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4 text-stone-900">
                      {new Date(stat.month + '-01').toLocaleDateString('ar-SA', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 px-4 text-right text-stone-900 font-medium">
                      {stat.count}
                    </td>
                    <td className="py-3 px-4 text-right text-stone-600">
                      {cumulativeTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
