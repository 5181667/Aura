"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TestResult {
    createdAt: Date
    score: string
}

export default function ScoreTrendChart({ results, testTitle }: { results: TestResult[], testTitle: string }) {
    // For personality tests, we might not have numeric scores
    // This is a simplified version - you might need to adapt based on your scoring system
    
    const data = results.map((result, index) => ({
        name: `第${index + 1}次`,
        date: new Date(result.createdAt).toLocaleDateString('zh-CN', { 
            month: 'short', 
            day: 'numeric' 
        }),
        score: result.score // For numeric tests
    }))

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>
                {testTitle} - 历史趋势
            </h4>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        dataKey="date" 
                        stroke="rgba(248, 250, 252, 0.6)"
                        fontSize={12}
                    />
                    <YAxis 
                        stroke="rgba(248, 250, 252, 0.6)"
                        fontSize={12}
                    />
                    <Tooltip 
                        contentStyle={{
                            background: 'rgba(15, 15, 25, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#f8fafc'
                        }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 5 }}
                        activeDot={{ r: 7 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
