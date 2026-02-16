'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface AnalysisCardProps {
    title: string
    description?: string
    children: ReactNode
    icon?: ReactNode
}

export function AnalysisCard({ title, description, children, icon }: AnalysisCardProps) {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
                <div className="flex items-center gap-2">
                    {icon}
                    <CardTitle className="text-lg">{title}</CardTitle>
                </div>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
