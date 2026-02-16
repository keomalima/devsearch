import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { buildCoverLetterAdvicePrompt } from '@/lib/openai/prompts'
import { CoverLetterAdvice } from '@/lib/types'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const { offer_id, user_notes } = await request.json()

        if (!offer_id) {
            return NextResponse.json(
                { error: 'ID de l\'offre requis' },
                { status: 400 }
            )
        }

        // Get the job offer
        const { data: offer, error: offerError } = await supabase
            .from('job_offers')
            .select('*')
            .eq('id', offer_id)
            .eq('user_id', user.id)
            .single()

        if (offerError || !offer) {
            return NextResponse.json(
                { error: 'Offre non trouvée' },
                { status: 404 }
            )
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('cv_text')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.cv_text) {
            return NextResponse.json(
                { error: 'Veuillez compléter votre profil avec votre CV' },
                { status: 400 }
            )
        }

        // Generate cover letter advice
        const prompt = buildCoverLetterAdvicePrompt(
            profile.cv_text,
            offer.company_name,
            offer.position_title,
            offer.location || '',
            offer.company_description || '',
            offer.job_description,
            user_notes || '',
            offer.ai_analysis.profile_alignment
        )

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Tu es un conseiller en carrière expert. Réponds UNIQUEMENT avec du JSON valide en français, sans texte supplémentaire.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        })

        const content = completion.choices[0].message.content

        if (!content) {
            throw new Error('Pas de réponse de l\'IA')
        }

        const advice: CoverLetterAdvice = JSON.parse(content)

        // Store the advice as JSON string in cover_letter field
        const adviceString = JSON.stringify(advice)

        // Update the offer with the cover letter advice and user notes
        const { error: updateError } = await supabase
            .from('job_offers')
            .update({
                cover_letter: adviceString,
                user_notes: user_notes || null,
            })
            .eq('id', offer_id)
            .eq('user_id', user.id)

        if (updateError) {
            throw updateError
        }

        return NextResponse.json({ cover_letter_advice: advice })
    } catch (error) {
        console.error('Error generating cover letter advice:', error)
        return NextResponse.json(
            { error: 'Échec de la génération des conseils' },
            { status: 500 }
        )
    }
}
