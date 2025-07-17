import { useState, useEffect } from 'react'
import { 
  Heart, 
  Activity, 
  Weight, 
  Thermometer,
  Plus,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { MetricCard } from './MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { blink } from '@/blink/client'
import type { HealthRecord, AIInsight } from '@/types/health'

// Sample data for demo
const sampleMetrics = [
  {
    title: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    trend: 'stable' as const,
    change: '0%',
    icon: <Heart className="h-4 w-4" />,
    color: 'red' as const
  },
  {
    title: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    trend: 'down' as const,
    change: '-2%',
    icon: <Activity className="h-4 w-4" />,
    color: 'green' as const
  },
  {
    title: 'Weight',
    value: '70.5',
    unit: 'kg',
    trend: 'down' as const,
    change: '-0.5kg',
    icon: <Weight className="h-4 w-4" />,
    color: 'blue' as const
  },
  {
    title: 'Body Temperature',
    value: '36.8',
    unit: '°C',
    trend: 'stable' as const,
    change: '0%',
    icon: <Thermometer className="h-4 w-4" />,
    color: 'yellow' as const
  }
]

const sampleChartData = [
  { date: '2024-01-01', weight: 71.2, heartRate: 75 },
  { date: '2024-01-08', weight: 71.0, heartRate: 73 },
  { date: '2024-01-15', weight: 70.8, heartRate: 72 },
  { date: '2024-01-22', weight: 70.6, heartRate: 71 },
  { date: '2024-01-29', weight: 70.5, heartRate: 72 },
]

export function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [recentRecords, setRecentRecords] = useState<HealthRecord[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = async () => {
    try {
      // Initialize database tables if they don't exist
      await blink.db.healthRecords.list({ limit: 1 }).catch(async () => {
        // Tables don't exist, create them
        console.log('Initializing health tracking database...')
      })

      // Generate sample AI insights
      generateSampleInsights()
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const generateSampleInsights = async () => {
    const sampleInsights: AIInsight[] = [
      {
        id: 'insight_1',
        userId: user?.id || '',
        type: 'recommendation',
        title: 'Improve Sleep Quality',
        description: 'Based on your recent heart rate variability data, consider establishing a consistent bedtime routine to improve recovery.',
        confidence: 0.85,
        priority: 'medium',
        createdAt: new Date().toISOString()
      },
      {
        id: 'insight_2',
        userId: user?.id || '',
        type: 'trend',
        title: 'Weight Loss Progress',
        description: 'You\'ve maintained a steady weight loss trend over the past month. Keep up the great work!',
        confidence: 0.92,
        priority: 'low',
        createdAt: new Date().toISOString()
      },
      {
        id: 'insight_3',
        userId: user?.id || '',
        type: 'warning',
        title: 'Blood Pressure Monitoring',
        description: 'Your blood pressure readings show some variation. Consider monitoring more frequently and consulting your healthcare provider.',
        confidence: 0.78,
        priority: 'high',
        createdAt: new Date().toISOString()
      }
    ]
    setInsights(sampleInsights)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your health dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to HealthTracker</h2>
          <p className="text-gray-600 mb-4">Please sign in to access your health dashboard</p>
          <Button onClick={() => blink.auth.login()}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">Here's your health overview for today</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts and Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Health Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    name="Weight (kg)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Heart Rate (bpm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              AI Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-3 rounded-lg bg-gray-50 border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {insight.description}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : insight.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent health records found.</p>
            <p className="text-sm">Start tracking your health by adding your first record!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}