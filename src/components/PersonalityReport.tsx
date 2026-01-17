"use client"

import styles from './PersonalityReport.module.css'

interface PersonalityReportProps {
    dimensions: {
        openness: number
        conscientiousness: number
        extraversion: number
        agreeableness: number
        neuroticism: number
    }
}

const getDimensionDescription = (name: string, score: number) => {
    const descriptions: { [key: string]: { [key: string]: string } } = {
        openness: {
            high: "你富有想象力，喜欢探索新事物，对艺术和抽象概念有强烈兴趣。你总是寻求新的体验和知识。",
            medium: "你在传统与创新之间保持平衡，既欣赏熟悉的事物，也愿意尝试新鲜事物。",
            low: "你更倾向于熟悉和具体的事物，喜欢按部就班的生活方式，偏好实用性而非抽象概念。"
        },
        conscientiousness: {
            high: "你高度自律，做事有条理，注重细节。你会精心计划并努力实现目标，责任感强。",
            medium: "你在组织性和灵活性之间找到平衡，既能按计划行事，也能随机应变。",
            low: "你更加随性自由，不太喜欢严格的计划，倾向于即兴发挥和享受当下。"
        },
        extraversion: {
            high: "你充满活力，喜欢社交，在人群中感到兴奋。你健谈、热情，容易与他人建立联系。",
            medium: "你在独处和社交之间保持平衡，既享受与人交往，也珍惜个人时间。",
            low: "你更内向，喜欢安静和独处的时光。你倾向于深度思考，在小群体中更自在。"
        },
        agreeableness: {
            high: "你富有同情心，乐于助人，重视和谐的人际关系。你信任他人，愿意为他人着想。",
            medium: "你在同情心和客观性之间保持平衡，既关心他人也维护自己的立场。",
            low: "你更注重事实和逻辑，不容易被情感左右。你坦率直接，在竞争中不轻易妥协。"
        },
        neuroticism: {
            high: "你情感丰富敏感，容易体验到强烈的情绪波动。你对压力反应明显，需要更多情绪调节。",
            medium: "你的情绪稳定性适中，既能感受情感，也能保持相对平静。",
            low: "你情绪稳定，心态平和，不容易焦虑或沮丧。你在压力下能保持冷静。"
        }
    }

    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'
    return descriptions[name]?.[level] || ""
}

const dimensionLabels: { [key: string]: string } = {
    openness: '开放性',
    conscientiousness: '尽责性',
    extraversion: '外向性',
    agreeableness: '亲和性',
    neuroticism: '神经质'
}

export default function PersonalityReport({ dimensions }: PersonalityReportProps) {
    return (
        <div className={styles.report}>
            <h3 className={styles.title}>性格深度解析</h3>
            
            {Object.entries(dimensions).map(([key, value]) => (
                <div key={key} className={styles.dimensionCard}>
                    <div className={styles.dimensionHeader}>
                        <h4>{dimensionLabels[key]}</h4>
                        <span className={styles.score}>{value}分</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progress} 
                            style={{ width: `${value}%` }}
                        />
                    </div>
                    <p className={styles.description}>
                        {getDimensionDescription(key, value)}
                    </p>
                </div>
            ))}
            
            <div className={styles.summary}>
                <h4>综合评价</h4>
                <p>
                    你的性格特点独特而丰富。{dimensions.extraversion >= 60 ? '你善于社交，' : '你内敛沉静，'}
                    {dimensions.openness >= 60 ? '富有创造力，' : '注重实际，'}
                    {dimensions.conscientiousness >= 60 ? '做事严谨有序。' : '灵活自由。'}
                    在人际关系中，{dimensions.agreeableness >= 60 ? '你温和友善，容易相处。' : '你坦率真诚，有自己的原则。'}
                </p>
            </div>
        </div>
    )
}
