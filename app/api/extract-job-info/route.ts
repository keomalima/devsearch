import { NextRequest, NextResponse } from 'next/server'
import { buildJobInfoExtractionPrompt } from '@/lib/openai/prompts'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
    try {
        const { job_description } = await request.json()

        if (!job_description) {
            return NextResponse.json(
                { error: 'Description du poste requise' },
                { status: 400 }
            )
        }

        // Extract basic job info (company name, position, location)
        const basicExtractionPrompt = `Extrais UNIQUEMENT le nom de l'entreprise, le titre du poste et le lieu de cette description de poste. Réponds en JSON:

Description:
${job_description}

Format de réponse:
{
  "company_name": "<nom de l'entreprise>",
  "position_title": "<titre du poste>",
  "location": "<lieu (ville, pays, ou 'Remote')>"
}`

        const basicCompletion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Tu es un assistant expert. Réponds UNIQUEMENT avec du JSON valide.',
                },
                {
                    role: 'user',
                    content: basicExtractionPrompt,
                },
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' },
        })

        const extractedInfo = JSON.parse(
            basicCompletion.choices[0].message.content || '{}'
        )

        // If we have a company name, search the web for company information
        let companyDescription = ''
        if (extractedInfo.company_name) {
            try {
                // Search the web for company information
                const searchQuery = `${extractedInfo.company_name} company what do they do business overview`

                // Use a simple fetch to a search API or web scraping service
                // For now, we'll use the AI to generate a description based on web knowledge
                const companyPrompt = `Fournis une description courte (2-3 phrases) de l'entreprise "${extractedInfo.company_name}" basée sur tes connaissances. Décris ce qu'ils font, leur secteur d'activité, et leur taille approximative si connue. Réponds UNIQUEMENT en français, en texte simple (pas de JSON).`

                const companyCompletion = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'Tu es un expert en entreprises et startups. Réponds en français avec des informations factuelles.',
                        },
                        {
                            role: 'user',
                            content: companyPrompt,
                        },
                    ],
                    temperature: 0.5,
                })

                companyDescription = companyCompletion.choices[0].message.content || ''
            } catch (searchError) {
                console.error('Error getting company info:', searchError)
                companyDescription = ''
            }
        }

        return NextResponse.json({
            ...extractedInfo,
            company_description: companyDescription,
        })
    } catch (error) {
        console.error('Error extracting job info:', error)
        return NextResponse.json(
            { error: 'Échec de l\'extraction des informations' },
            { status: 500 }
        )
    }
}
