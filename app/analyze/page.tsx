'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalysisCard } from '@/components/AnalysisCard'
import { MatchRateGauge } from '@/components/MatchRateGauge'
import { Badge } from '@/components/ui/badge'
import { JobAnalysis } from '@/lib/types'
import { Loader2, Sparkles, Save, CheckCircle2, AlertCircle, Lightbulb, Target, TrendingUp, Wand2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AnalyzePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        company_name: '',
        position_title: '',
        location: '',
        company_description: '',
        job_description: '',
        job_url: '',
    })
    const [analysis, setAnalysis] = useState<JobAnalysis | null>(null)
    const [loading, setLoading] = useState(false)
    const [extracting, setExtracting] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleExtractInfo = async () => {
        if (!formData.job_description) {
            setError('Veuillez d\'abord coller la description du poste')
            return
        }

        setExtracting(true)
        setError(null)

        try {
            const response = await fetch('/api/extract-job-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job_description: formData.job_description }),
            })

            if (!response.ok) {
                throw new Error('Erreur lors de l\'extraction')
            }

            const data = await response.json()
            setFormData({
                ...formData,
                company_name: data.company_name || formData.company_name,
                position_title: data.position_title || formData.position_title,
                location: data.location || formData.location,
                company_description: data.company_description || formData.company_description,
            })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setExtracting(false)
        }
    }

    const handleAnalyze = async () => {
        if (!formData.company_name || !formData.position_title || !formData.job_description) {
            setError('Veuillez remplir tous les champs obligatoires')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Erreur lors de l\'analyse')
            }

            const data = await response.json()
            setAnalysis(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!analysis) return

        setSaving(true)

        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: formData.company_name,
                    position_title: formData.position_title,
                    location: formData.location || null,
                    company_description: formData.company_description || null,
                    job_description: formData.job_description,
                    job_url: formData.job_url || null,
                    status: 'not_sent',
                    tech_stack: analysis.tech_stack,
                    ai_analysis: analysis,
                    application_date: new Date().toISOString().split('T')[0],
                }),
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde')
            }

            const data = await response.json()
            router.push(`/offers/${data.id}`)
        } catch (err) {
            setError('Erreur lors de la sauvegarde')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Analyser une offre</h1>
                <p className="mt-2 text-muted-foreground">
                    Collez la description du poste et laissez l'IA extraire les informations
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations de l'offre</CardTitle>
                    <CardDescription>
                        Collez la description complète, puis cliquez sur "Extraire les infos" pour remplir automatiquement les champs
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Description du poste <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                            placeholder="Collez ici la description complète du poste..."
                            className="min-h-[200px]"
                            value={formData.job_description}
                            onChange={(e) =>
                                setFormData({ ...formData, job_description: e.target.value })
                            }
                        />
                    </div>

                    <Button
                        onClick={handleExtractInfo}
                        disabled={extracting || !formData.job_description}
                        variant="outline"
                        className="w-full gap-2"
                    >
                        {extracting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Extraction en cours...
                            </>
                        ) : (
                            <>
                                <Wand2 className="h-4 w-4" />
                                Extraire les infos automatiquement
                            </>
                        )}
                    </Button>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Entreprise <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="Ex: Google"
                                value={formData.company_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, company_name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Poste <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="Ex: Développeur Full Stack"
                                value={formData.position_title}
                                onChange={(e) =>
                                    setFormData({ ...formData, position_title: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lieu</label>
                            <Input
                                placeholder="Ex: Paris, France ou Remote"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">URL de l'offre (optionnel)</label>
                            <Input
                                placeholder="https://..."
                                value={formData.job_url}
                                onChange={(e) =>
                                    setFormData({ ...formData, job_url: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description de l'entreprise</label>
                        <Textarea
                            placeholder="Courte description de l'entreprise..."
                            className="min-h-[80px]"
                            value={formData.company_description}
                            onChange={(e) =>
                                setFormData({ ...formData, company_description: e.target.value })
                            }
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleAnalyze}
                        disabled={loading}
                        size="lg"
                        className="w-full gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Analyse en cours...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                Analyser avec l'IA
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {analysis && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Résultats de l'analyse</h2>
                        <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2">
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Enregistrer dans le tableau de bord
                                </>
                            )}
                        </Button>
                    </div>

                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                        <CardContent className="pt-6">
                            <MatchRateGauge matchRate={analysis.match_rate} />
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <AnalysisCard
                            title="Tech Stack"
                            description="Technologies identifiées dans l'offre"
                            icon={<Target className="h-5 w-5 text-primary" />}
                        >
                            <div className="flex flex-wrap gap-2">
                                {analysis.tech_stack.map((tech) => (
                                    <Badge key={tech} variant="secondary">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </AnalysisCard>

                        <AnalysisCard
                            title="Missions principales"
                            description="Responsabilités clés du poste"
                            icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                        >
                            <ul className="space-y-2">
                                {analysis.missions.map((mission, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                        <span className="text-muted-foreground">•</span>
                                        <span>{mission}</span>
                                    </li>
                                ))}
                            </ul>
                        </AnalysisCard>

                        <AnalysisCard
                            title="Pourquoi ce poste ?"
                            description="Alignement avec votre profil"
                            icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
                        >
                            <p className="text-sm leading-relaxed">{analysis.profile_alignment}</p>
                            <ul className="mt-4 space-y-2">
                                {analysis.benefits.map((benefit, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </AnalysisCard>

                        <AnalysisCard
                            title="Points d'attention"
                            description="Compétences à développer"
                            icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
                        >
                            <ul className="space-y-2">
                                {analysis.gaps.map((gap, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                        <span className="text-yellow-500">⚠</span>
                                        <span>{gap}</span>
                                    </li>
                                ))}
                            </ul>
                        </AnalysisCard>
                    </div>
                </div>
            )}
        </div>
    )
}
