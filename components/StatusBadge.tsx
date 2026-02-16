'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
    status: 'applied' | 'interview' | 'rejected' | 'offer' | 'not_sent'
    className?: string
}

type JobOfferStatus = 'not_sent' | 'applied' | 'interview' | 'offer' | 'rejected';

const statusConfig: Record<JobOfferStatus, { label: string; className: string }> = {
    not_sent: {
        label: 'Non envoyée',
        className: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
    },
    applied: {
        label: 'Candidature envoyée',
        className: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    },
    interview: {
        label: 'Entretien',
        className: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
    },
    offer: {
        label: 'Offre reçue',
        className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    },
    rejected: {
        label: 'Refusée',
        className: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <Badge
            variant="outline"
            className={cn(config.className, className)}
        >
            {config.label}
        </Badge>
    )
}
