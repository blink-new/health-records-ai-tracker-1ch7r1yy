import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  unit?: string
  trend: 'up' | 'down' | 'stable'
  change: string
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow'
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  trend, 
  change, 
  icon, 
  color = 'blue' 
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />
      case 'down':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getIconColor = () => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50'
      case 'red':
        return 'text-red-600 bg-red-50'
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", getIconColor())}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-gray-900">
            {value}
          </div>
          {unit && (
            <span className="text-sm text-gray-500">{unit}</span>
          )}
        </div>
        <div className={cn("flex items-center gap-1 text-xs mt-1", getTrendColor())}>
          {getTrendIcon()}
          <span>{change}</span>
          <span className="text-gray-500">from last week</span>
        </div>
      </CardContent>
    </Card>
  )
}