export interface HealthRecord {
  id: string
  userId: string
  type: 'vitals' | 'medication' | 'appointment' | 'lab_result' | 'symptom' | 'exercise' | 'nutrition'
  title: string
  description?: string
  value?: number
  unit?: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface HealthMetric {
  id: string
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  lastUpdated: string
}

export interface AIInsight {
  id: string
  userId: string
  type: 'recommendation' | 'warning' | 'trend' | 'goal'
  title: string
  description: string
  confidence: number
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface HealthGoal {
  id: string
  userId: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  status: 'active' | 'completed' | 'paused'
  createdAt: string
}