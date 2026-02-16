import OpenAI from 'openai'
import { buildJobAnalysisPrompt } from './prompts'
import { JobAnalysis } from '../types'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeJobOffer(
    cvText: string,
    jobDescription: string,
    companyName: string,
    positionTitle: string,
    location: string = ''
): Promise<JobAnalysis> {
    try {
        const prompt = buildJobAnalysisPrompt(
            cvText,
            jobDescription,
            companyName,
            positionTitle,
            location
        )

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Tu es un conseiller en carrière expert. Réponds TOUJOURS avec du JSON valide uniquement, sans texte supplémentaire. Toutes tes réponses doivent être en français.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        })

        const content = completion.choices[0].message.content
        if (!content) {
            throw new Error('No response from OpenAI')
        }

        const analysis: JobAnalysis = JSON.parse(content)
        return analysis
    } catch (error) {
        console.error('Error analyzing job offer:', error)
        throw new Error('Failed to analyze job offer')
    }
}
