'use client'

import { useEffect, useState } from 'react'
import { ApplicationTable } from '@/components/ApplicationTable'
import { Button } from '@/components/ui/button'
import { JobOffer } from '@/lib/types'
import { Plus, Loader2, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [applications, setApplications] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data || [])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: JobOffer['status']) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app))
        )
      }
    } catch (error) {
      console.error('Error updating status:', error)
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez vos candidatures de stage et suivez leur progression
          </p>
        </div>
        <Link href="/analyze">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Analyser une nouvelle offre
          </Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-16">
          <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Aucune candidature</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Commencez par analyser votre première offre de stage
          </p>
          <Link href="/analyze">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Analyser une offre
            </Button>
          </Link>
        </div>
      ) : (
        <ApplicationTable
          applications={applications}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
