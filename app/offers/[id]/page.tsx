'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { JobOffer } from '@/lib/types'
import { AnalysisCard } from '@/components/AnalysisCard'
import { MatchRateGauge } from '@/components/MatchRateGauge'
import { StrategicAnalysis } from '@/components/StrategicAnalysis'
import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Loader2,
    ArrowLeft,
    ExternalLink,
    Copy,
    Check,
    Target,
    CheckCircle2,
    TrendingUp,
    Lightbulb,
    FileText,
    MessageSquare,
    MapPin,
    Building2,
    Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function OfferDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [offer, setOffer] = useState<JobOffer | null>(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [userNotes, setUserNotes] = useState('')
    const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)

    useEffect(() => {
        fetchOffer()
    }, [params.id])

    const fetchOffer = async () => {
        try {
            const response = await fetch('/api/applications')
            if (response.ok) {
                const data = await response.json()
                const foundOffer = data.find((app: JobOffer) => app.id === params.id)
                if (foundOffer) {
                    setOffer(foundOffer)
                    setUserNotes(foundOffer.user_notes || '')
                } else {
                    router.push('/')
                }
            }
        } catch (error) {
            console.error('Error fetching offer:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleGenerateCoverLetter = async () => {
        if (!offer) return

        setGeneratingCoverLetter(true)

        try {
            const response = await fetch('/api/generate-cover-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offer_id: offer.id,
                    user_notes: userNotes,
                }),
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la génération')
            }

            const data = await response.json()
            // Store the advice as JSON string
            const adviceString = JSON.stringify(data.cover_letter_advice)

            setOffer({
                ...offer,
                cover_letter: adviceString,
                user_notes: userNotes,
            })
        } catch (error) {
            console.error('Error generating cover letter:', error)
            alert('Erreur lors de la génération des conseils')
        } finally {
            setGeneratingCoverLetter(false)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (!offer) return

        setUpdatingStatus(true)

        try {
            const response = await fetch('/api/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: offer.id,
                    status: newStatus,
                }),
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour')
            }

            const updatedOffer = await response.json()
            setOffer(updatedOffer)
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Erreur lors de la mise à jour du statut')
        } finally {
            setUpdatingStatus(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!offer) {
        return null
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <Link href="/">
                    <Button variant="ghost" className="mb-4 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour au tableau de bord
                    </Button>
                </Link>

                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">
                            {offer.company_name}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {offer.position_title}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            {offer.location && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {offer.location}
                                </div>
                            )}
                            <span className="text-sm text-muted-foreground">
                                Postulé le{' '}
                                {format(new Date(offer.application_date), 'dd MMMM yyyy', {
                                    locale: fr,
                                })}
                            </span>
                            {offer.job_url && (
                                <a
                                    href={offer.job_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    Voir l'offre <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                        {offer.company_description && (
                            <div className="flex items-start gap-2 mt-2 p-3 rounded-md bg-muted/50">
                                <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {offer.company_description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <label className="text-sm font-medium">Statut:</label>
                    <Select
                        value={offer.status}
                        onValueChange={handleStatusChange}
                        disabled={updatingStatus}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="not_sent">Non envoyée</SelectItem>
                            <SelectItem value="applied">Candidature envoyée</SelectItem>
                            <SelectItem value="interview">Entretien</SelectItem>
                            <SelectItem value="offer">Offre reçue</SelectItem>
                            <SelectItem value="rejected">Refusée</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                    <MatchRateGauge matchRate={offer.ai_analysis.match_rate} />
                </CardContent>
            </Card>

            {/* Tech Stack & Missions */}
            <div className="grid gap-6 md:grid-cols-2">
                <AnalysisCard
                    title="Tech Stack"
                    description="Technologies identifiées"
                    icon={<Target className="h-5 w-5 text-primary" />}
                >
                    <div className="flex flex-wrap gap-2">
                        {offer.ai_analysis.tech_stack.map((tech) => (
                            <Badge key={tech} variant="secondary">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </AnalysisCard>

                <AnalysisCard
                    title="Missions principales"
                    description="Responsabilités du poste"
                    icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                >
                    <ul className="space-y-2">
                        {offer.ai_analysis.missions.map((mission, i) => (
                            <li key={i} className="flex gap-2 text-sm">
                                <span className="text-muted-foreground">•</span>
                                <span>{mission}</span>
                            </li>
                        ))}
                    </ul>
                </AnalysisCard>
            </div>

            {/* Strategic Analysis Component */}
            <StrategicAnalysis analysis={offer.ai_analysis} />

            <AnalysisCard
                title="Conseils stratégiques pour votre lettre de motivation"
                description="Angles et approches recommandés par l'IA"
                icon={<FileText className="h-5 w-5 text-purple-500" />}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Notes personnelles (optionnel)
                        </label>
                        <Textarea
                            placeholder="Ex: Je suis particulièrement intéressé par votre équipe IA. J'ai déjà travaillé sur un projet similaire..."
                            className="min-h-[100px]"
                            value={userNotes}
                            onChange={(e) => setUserNotes(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleGenerateCoverLetter}
                        disabled={generatingCoverLetter}
                        className="gap-2"
                    >
                        {generatingCoverLetter ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Génération en cours...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                {offer.cover_letter ? 'Régénérer' : 'Générer'} les conseils
                            </>
                        )}
                    </Button>

                    {offer.cover_letter && (() => {
                        try {
                            const advice = JSON.parse(offer.cover_letter)
                            return (
                                <div className="space-y-6 pt-4 border-t">
                                    {/* Angles clés */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                            <span className="text-purple-500">🎯</span>
                                            Angles clés à mettre en avant
                                        </h4>
                                        <ul className="space-y-2">
                                            {advice.angles_cles?.map((angle: string, i: number) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-purple-500 font-bold">{i + 1}.</span>
                                                    <span>{angle}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Expériences à highlighter */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                            <span className="text-blue-500">💼</span>
                                            Expériences à mettre en avant
                                        </h4>
                                        <ul className="space-y-2">
                                            {advice.experiences_a_highlighter?.map((exp: string, i: number) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-blue-500">•</span>
                                                    <span>{exp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Alignement entreprise */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            Points d'alignement avec l'entreprise
                                        </h4>
                                        <ul className="space-y-2">
                                            {advice.alignement_entreprise?.map((point: string, i: number) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-green-500">→</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Préoccupations à adresser */}
                                    {advice.preoccupations_a_adresser && advice.preoccupations_a_adresser.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                                <span className="text-yellow-500">⚠️</span>
                                                Préoccupations potentielles à adresser
                                            </h4>
                                            <ul className="space-y-2">
                                                {advice.preoccupations_a_adresser.map((concern: string, i: number) => (
                                                    <li key={i} className="flex gap-2 text-sm">
                                                        <span className="text-yellow-500">!</span>
                                                        <span>{concern}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Exemples de paragraphes réutilisables */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                            <span className="text-purple-500">📝</span>
                                            Exemples de paragraphes à réutiliser
                                        </h4>
                                        <div className="space-y-3">
                                            {advice.exemples_paragraphes?.map((paragraph: string, i: number) => (
                                                <div key={i} className="rounded-md bg-purple-500/5 p-3 border border-purple-500/20">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-xs font-bold text-purple-600 mt-0.5">#{i + 1}</span>
                                                        <p className="text-sm leading-relaxed flex-1">{paragraph}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Conseils ouverture et clôture */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2 rounded-md bg-blue-500/5 p-4 border border-blue-500/20">
                                            <h4 className="font-semibold text-sm text-blue-600">
                                                📝 Conseil pour l'ouverture
                                            </h4>
                                            <p className="text-sm">{advice.conseil_ouverture}</p>
                                        </div>
                                        <div className="space-y-2 rounded-md bg-green-500/5 p-4 border border-green-500/20">
                                            <h4 className="font-semibold text-sm text-green-600">
                                                ✍️ Conseil pour la clôture
                                            </h4>
                                            <p className="text-sm">{advice.conseil_cloture}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        } catch (e) {
                            // Fallback for old format (plain text)
                            return (
                                <div className="space-y-3 pt-4 border-t">
                                    <div className="rounded-md bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                                        {offer.cover_letter}
                                    </div>
                                    <Button
                                        onClick={() => handleCopy(offer.cover_letter!)}
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Copié !
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copier la lettre
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )
                        }
                    })()}
                </div>
            </AnalysisCard>
        </div>
    )
}
