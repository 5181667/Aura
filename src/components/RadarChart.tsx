"use client"

import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface RadarChartProps {
    dimensions: {
        openness: number
        conscientiousness: number
        extraversion: number
        agreeableness: number
        neuroticism: number
    }
}

export default function RadarChart({ dimensions }: RadarChartProps) {
    const data = [
        { subject: '开放性', value: Math.round(dimensions.openness), fullMark: 100 },
        { subject: '尽责性', value: Math.round(dimensions.conscientiousness), fullMark: 100 },
        { subject: '外向性', value: Math.round(dimensions.extraversion), fullMark: 100 },
        { subject: '亲和性', value: Math.round(dimensions.agreeableness), fullMark: 100 },
        { subject: '神经质', value: Math.round(dimensions.neuroticism), fullMark: 100 },
    ]

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadar cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#f8fafc', fontSize: 14 }}
                    />
                    <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Radar
                        name="性格维度"
                        dataKey="value"
                        stroke="#14b8a6"
                        fill="#14b8a6"
                        fillOpacity={0.6}
                    />
                    <Tooltip 
                        contentStyle={{
                            background: 'rgba(15, 15, 25, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#f8fafc'
                        }}
                    />
                </RechartsRadar>
            </ResponsiveContainer>
        </div>
    )
}
