// Helper component for the strategic analysis cards
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, AlertCircle, Target, Eye, Brain, Lightbulb, Shield, TrendingUp } from 'lucide-react'
import { JobAnalysis } from '@/lib/types'

interface StrategicAnalysisProps {
    analysis: JobAnalysis
}

export function StrategicAnalysis({ analysis }: StrategicAnalysisProps) {
    // Check if this is the new strategic analysis format
    const isNewFormat = 'strategic_verdict' in analysis && analysis.strategic_verdict !== undefined

    // If old format, show message to re-analyze
    if (!isNewFormat) {
        return (
            <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
                        <h3 className="font-semibold text-lg">Analyse au format ancien</h3>
                        <p className="text-sm text-muted-foreground">
                            Cette offre utilise l'ancien format d'analyse. Pour bénéficier de l'analyse stratégique complète avec verdict et conseils de positionnement, veuillez ré-analyser cette offre.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const getRecommendationColor = (rec: string) => {
        switch (rec) {
            case 'APPLY': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'STRATEGIC_APPLY': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            case 'SKIP': return 'bg-red-500/10 text-red-700 border-red-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
    }

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'LOW': return 'text-green-600'
            case 'MEDIUM': return 'text-yellow-600'
            case 'HIGH': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    const getRecommendationText = (rec: string) => {
        switch (rec) {
            case 'APPLY': return '✅ Candidater'
            case 'STRATEGIC_APPLY': return '⚡ Candidater stratégiquement'
            case 'SKIP': return '❌ Passer'
            default: return rec
        }
    }

    return (
        <div className="space-y-6">
            {/* Strategic Verdict - Most Important */}
            <Card className={`border-2 ${getRecommendationColor(analysis.strategic_verdict.recommendation)}`}>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield className="h-6 w-6" />
                                    <h3 className="text-lg font-bold">Verdict Stratégique</h3>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge variant="outline" className="text-base font-bold px-3 py-1">
                                        {getRecommendationText(analysis.strategic_verdict.recommendation)}
                                    </Badge>
                                    <span className={`text-sm font-semibold ${getRiskColor(analysis.strategic_verdict.risk_level)}`}>
                                        Risque: {analysis.strategic_verdict.risk_level}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    {analysis.strategic_verdict.reasoning}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Real Priorities & Hidden Expectations */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="h-5 w-5 text-purple-500" />
                            <h4 className="font-semibold">Ce qu'ils valorisent vraiment</h4>
                        </div>
                        <ul className="space-y-2">
                            {analysis.real_priorities.map((priority, i) => (
                                <li key={i} className="flex gap-2 text-sm">
                                    <span className="text-purple-500 font-bold">•</span>
                                    <span>{priority}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="h-5 w-5 text-cyan-500" />
                            <h4 className="font-semibold">Attentes cachées</h4>
                        </div>
                        <ul className="space-y-2">
                            {analysis.hidden_expectations.map((expectation, i) => (
                                <li key={i} className="flex gap-2 text-sm">
                                    <span className="text-cyan-500">→</span>
                                    <span>{expectation}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Fit Analysis */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold text-lg">Analyse d'adéquation</h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                Points forts
                            </div>
                            <ul className="space-y-1.5">
                                {analysis.fit_analysis.strong_match.map((item, i) => (
                                    <li key={i} className="text-sm flex gap-1.5">
                                        <span className="text-green-500">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm">
                                <AlertCircle className="h-4 w-4" />
                                Points moyens
                            </div>
                            <ul className="space-y-1.5">
                                {analysis.fit_analysis.weak_match.map((item, i) => (
                                    <li key={i} className="text-sm flex gap-1.5">
                                        <span className="text-yellow-500">~</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                                <AlertTriangle className="h-4 w-4" />
                                Lacunes critiques
                            </div>
                            <ul className="space-y-1.5">
                                {analysis.fit_analysis.critical_gaps.map((item, i) => (
                                    <li key={i} className="text-sm flex gap-1.5">
                                        <span className="text-red-500">!</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Positioning Strategy */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-lg">Stratégie de positionnement</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h5 className="text-sm font-semibold text-primary mb-2">📄 CV - Éléments à mettre en avant</h5>
                            <p className="text-sm leading-relaxed">{analysis.positioning_strategy.cv_highlights}</p>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold text-primary mb-2">✍️ Lettre de motivation - Angle principal</h5>
                            <p className="text-sm leading-relaxed">{analysis.positioning_strategy.cover_letter_angle}</p>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold text-primary mb-2">💼 Entretien - Préparation</h5>
                            <p className="text-sm leading-relaxed">{analysis.positioning_strategy.interview_prep}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tactical Examples for Cover Letter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="h-5 w-5 text-purple-500" />
                        <h4 className="font-semibold">Paragraphes exemples pour votre lettre</h4>
                    </div>
                    <div className="space-y-3">
                        {analysis.tactical_examples.map((example, i) => (
                            <div key={i} className="rounded-md bg-purple-500/5 p-3 border border-purple-500/20">
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-bold text-purple-600 mt-0.5">#{i + 1}</span>
                                    <p className="text-sm leading-relaxed flex-1">{example}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Interview Traps */}
            <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h4 className="font-semibold text-red-700">Pièges potentiels en entretien</h4>
                    </div>
                    <ul className="space-y-2">
                        {analysis.interview_traps.map((trap, i) => (
                            <li key={i} className="flex gap-2 text-sm">
                                <span className="text-red-500">⚠</span>
                                <span>{trap}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
