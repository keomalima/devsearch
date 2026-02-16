'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserProfile } from '@/lib/types'
import { Loader2, Save, Plus, X } from 'lucide-react'

export default function ProfilePage() {
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        cv_text: '',
        preferences: {
            remote_work: false,
            salary_expectation: '',
            target_technologies: [],
            career_goals: '',
        },
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [newTech, setNewTech] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile')
            if (response.ok) {
                const data = await response.json()
                if (data) {
                    setProfile(data)
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde')
            }

            alert('Profil sauvegardé avec succès !')
        } catch (error) {
            alert('Erreur lors de la sauvegarde du profil')
        } finally {
            setSaving(false)
        }
    }

    const addTechnology = () => {
        if (newTech.trim() && profile.preferences) {
            setProfile({
                ...profile,
                preferences: {
                    ...profile.preferences,
                    target_technologies: [
                        ...(profile.preferences.target_technologies || []),
                        newTech.trim(),
                    ],
                },
            })
            setNewTech('')
        }
    }

    const removeTechnology = (tech: string) => {
        if (profile.preferences) {
            setProfile({
                ...profile,
                preferences: {
                    ...profile.preferences,
                    target_technologies: profile.preferences.target_technologies?.filter(
                        (t) => t !== tech
                    ) || [],
                },
            })
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Profil</h1>
                <p className="mt-2 text-muted-foreground">
                    Configurez votre CV et vos préférences pour des analyses personnalisées
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Votre CV</CardTitle>
                    <CardDescription>
                        Collez le contenu de votre CV. Pour de meilleurs résultats, utilisez un format JSON structuré.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                        💡 <strong>Astuce:</strong> Utilisez un format JSON pour une meilleure analyse IA. Exemple:
                        <pre className="mt-2 overflow-x-auto">
                            {`{
  "experience": [...],
  "competences": [...],
  "formation": [...]
}`}
                        </pre>
                    </div>
                    <Textarea
                        placeholder="Collez ici le contenu de votre CV (texte ou JSON)..."
                        className="min-h-[300px] font-mono text-sm"
                        value={profile.cv_text}
                        onChange={(e) => setProfile({ ...profile, cv_text: e.target.value })}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Objectifs de carrière</CardTitle>
                    <CardDescription>
                        Définissez vos préférences et objectifs professionnels
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Objectifs professionnels</label>
                        <Textarea
                            placeholder="Décrivez vos objectifs de carrière, ce que vous recherchez dans un stage..."
                            className="min-h-[100px]"
                            value={profile.preferences?.career_goals || ''}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    preferences: {
                                        ...profile.preferences!,
                                        career_goals: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Attentes salariales</label>
                        <Input
                            placeholder="Ex: 1200€/mois"
                            value={profile.preferences?.salary_expectation || ''}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    preferences: {
                                        ...profile.preferences!,
                                        salary_expectation: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Technologies cibles</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ex: React, Node.js, Python..."
                                value={newTech}
                                onChange={(e) => setNewTech(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                            />
                            <Button onClick={addTechnology} variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Ajouter
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {profile.preferences?.target_technologies?.map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                                    onClick={() => removeTechnology(tech)}
                                >
                                    {tech}
                                    <X className="h-3 w-3" />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remote"
                            checked={profile.preferences?.remote_work || false}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    preferences: {
                                        ...profile.preferences!,
                                        remote_work: e.target.checked,
                                    },
                                })
                            }
                            className="h-4 w-4 rounded border-border"
                        />
                        <label htmlFor="remote" className="text-sm font-medium cursor-pointer">
                            Préférence pour le télétravail
                        </label>
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving} size="lg" className="w-full gap-2">
                {saving ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sauvegarde...
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4" />
                        Sauvegarder le profil
                    </>
                )}
            </Button>
        </div>
    )
}
