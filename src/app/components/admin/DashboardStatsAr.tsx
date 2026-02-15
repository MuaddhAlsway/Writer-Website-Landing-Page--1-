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
  // Helper function to parse month string safely
  const parseMonthDate = (monthStr: string): Date | null => {
    try {
      if (!monthStr || typeof monthStr !== 'string') {
        return null;
      }

      // Handle format like "2026-02"
      if (monthStr.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = monthStr.split('-');
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        
        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          return null;
        }
        
        const date = new Date(yearNum, monthNum - 1, 1);
        return isNaN(date.getTime()) ? null : date;
      }
      
      // Handle format like "2026-02-01"
      if (monthStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(monthStr + 'T00:00:00Z');
        return isNaN(date.getTime()) ? null : date;
      }
      
      // Try parsing as ISO string
      const date = new Date(monthStr);
      return isNaN(date.getTime()) ? null : date;
    } catch (e) {
      console.error('Error parsing month date:', monthStr, e);
      return null;
    }
  };

  // Format month data for charts
  const chartData = stats.monthlyStats.map((stat) => {
    const date = parseMonthDate(stat.month);
    if (date && !isNaN(date.getTime())) {
      return {
        month: date.toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' }),
        subscribers: stat.count,
      };
    }
    return {
      month: stat.month,
      subscribers: stat.count,
    };
  });

  // Calculate cumulative data
  let cumulative = 0;
  const cumulativeData = stats.monthlyStats.map((stat) => {
    cumulative += stat.count;
    const date = parseMonthDate(stat.month);
    if (date && !isNaN(date.getTime())) {
      return {
        month: date.toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' }),
        total: cumulative,
      };
    }
    return {
      month: stat.month,
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
                <th className="text-right py-3 px-4 text-stone-700 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthlyStats.map((stat) => {
                const date = parseMonthDate(stat.month);
                const monthDisplay = date && !isNaN(date.getTime()) 
                  ? date.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })
                  : stat.month;
                
                return (
                  <tr key={stat.month} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4 text-stone-900">
                      {monthDisplay}
                    </td>
                    <td className="py-3 px-4 text-right text-stone-600">
                      ✓ نشط ({stat.count})
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
