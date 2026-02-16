'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface MatchRateGaugeProps {
    matchRate: number
    className?: string
}

export function MatchRateGauge({ matchRate, className }: MatchRateGaugeProps) {
    const getColor = (rate: number) => {
        if (rate >= 80) return 'text-green-500'
        if (rate >= 60) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getProgressColor = (rate: number) => {
        if (rate >= 80) return '[&>div]:bg-green-500'
        if (rate >= 60) return '[&>div]:bg-yellow-500'
        return '[&>div]:bg-red-500'
    }

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                    Taux de correspondance
                </span>
                <span className={cn('text-2xl font-bold', getColor(matchRate))}>
                    {matchRate}%
                </span>
            </div>
            <Progress
                value={matchRate}
                className={cn('h-2', getProgressColor(matchRate))}
            />
        </div>
    )
}
