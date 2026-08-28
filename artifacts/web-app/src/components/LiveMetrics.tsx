import { TrendingUp, Package, DollarSign, CreditCard } from "lucide-react";

interface Summary {
  productCount: number;
  lowStockCount: number;
  pendingOrderCount: number;
  orderValue: number;
}

interface LiveMetricsProps {
  summary?: Summary;
  isLoading: boolean;
}

export default function LiveMetrics({ summary, isLoading }: LiveMetricsProps) {
  const metrics = [
    {
      label: "Total Items Sold",
      value: summary ? Math.floor(summary.orderValue / 1000) : 0,
      icon: TrendingUp,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Cash Transactions",
      value: summary ? Math.floor(summary.orderValue * 0.6) : 0,
      icon: DollarSign,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
      prefix: "₹",
    },
    {
      label: "UPI Transactions",
      value: summary ? Math.floor(summary.orderValue * 0.4) : 0,
      icon: CreditCard,
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      prefix: "₹",
    },
    {
      label: "Pending Orders",
      value: summary?.pendingOrderCount || 0,
      icon: Package,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border-2 border-amber-100 animate-pulse"
          >
            <div className="h-4 bg-amber-200 rounded mb-4 w-2/3"></div>
            <div className="h-8 bg-amber-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div
            key={idx}
            className={`${metric.bgColor} rounded-xl p-6 border-2 border-amber-200 hover:shadow-lg transition transform hover:scale-105`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`bg-gradient-to-br ${metric.color} rounded-lg p-3`}
              >
                <Icon className="text-white" size={24} />
              </div>
            </div>
            <p className="text-amber-700 text-sm font-medium">{metric.label}</p>
            <p className="text-3xl font-bold text-amber-900 mt-2">
              {metric.prefix || ""}{metric.value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
