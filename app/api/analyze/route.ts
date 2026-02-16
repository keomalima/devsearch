import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeJobOffer } from '@/lib/openai/client'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('cv_text')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.cv_text) {
            return NextResponse.json(
                { error: 'Please complete your profile with CV text first' },
                { status: 400 }
            )
        }

        const { job_description, company_name, position_title, location } = await request.json()

        if (!job_description || !company_name || !position_title) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Call OpenAI to analyze the job
        const analysis = await analyzeJobOffer(
            profile.cv_text,
            job_description,
            company_name,
            position_title,
            location || ''
        )

        return NextResponse.json(analysis)
    } catch (error) {
        console.error('Error analyzing job:', error)
        return NextResponse.json(
            { error: 'Failed to analyze job offer' },
            { status: 500 }
        )
    }
}
