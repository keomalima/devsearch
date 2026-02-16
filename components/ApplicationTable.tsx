'use client'

import { useState } from 'react'
import { JobOffer } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ExternalLink, Search } from 'lucide-react'
import Link from 'next/link'

interface ApplicationTableProps {
    applications: JobOffer[]
    onStatusChange: (id: string, status: JobOffer['status']) => void
}

export function ApplicationTable({ applications, onStatusChange }: ApplicationTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<string>('all')

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.position_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.tech_stack.some((tech) =>
                tech.toLowerCase().includes(searchTerm.toLowerCase())
            )

        const matchesStatus = filterStatus === 'all' || app.status === filterStatus

        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par entreprise, poste ou technologie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="not_sent">Non envoyée</SelectItem>
                        <SelectItem value="applied">Postulé</SelectItem>
                        <SelectItem value="interview">Entretien</SelectItem>
                        <SelectItem value="rejected">Refusé</SelectItem>
                        <SelectItem value="offer">Offre</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Entreprise</TableHead>
                            <TableHead>Poste</TableHead>
                            <TableHead>Match</TableHead>
                            <TableHead>Tech Stack</TableHead>
                            <TableHead>Lien</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApplications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    Aucune candidature trouvée
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApplications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(app.application_date), 'dd MMM yyyy', {
                                            locale: fr,
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={app.status}
                                            onValueChange={(value) =>
                                                onStatusChange(app.id, value as JobOffer['status'])
                                            }
                                        >
                                            <SelectTrigger className="w-[150px] border-0 bg-transparent p-0">
                                                <StatusBadge status={app.status} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="not_sent">Non envoyée</SelectItem>
                                                <SelectItem value="applied">Postulé</SelectItem>
                                                <SelectItem value="interview">Entretien</SelectItem>
                                                <SelectItem value="rejected">Refusé</SelectItem>
                                                <SelectItem value="offer">Offre</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/offers/${app.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {app.company_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{app.position_title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                {app.ai_analysis.match_rate}%
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {app.tech_stack.slice(0, 3).map((tech) => (
                                                <Badge key={tech} variant="secondary" className="text-xs">
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {app.tech_stack.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{app.tech_stack.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {app.job_url ? (
                                            <Button variant="ghost" size="sm" asChild>
                                                <a
                                                    href={app.job_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
