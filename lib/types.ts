export interface JobAnalysis {
    match_rate: number
    tech_stack: string[]
    real_priorities: string[]
    hidden_expectations: string[]
    fit_analysis: {
        strong_match: string[]
        weak_match: string[]
        critical_gaps: string[]
    }
    strategic_verdict: {
        recommendation: 'APPLY' | 'STRATEGIC_APPLY' | 'SKIP'
        reasoning: string
        risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
    }
    positioning_strategy: {
        cv_highlights: string
        cover_letter_angle: string
        interview_prep: string
    }
    tactical_examples: string[]
    interview_traps: string[]
    missions: string[]
}

export interface CoverLetterAdvice {
    angles_cles: string[]
    experiences_a_highlighter: string[]
    alignement_entreprise: string[]
    preoccupations_a_adresser: string[]
    exemples_paragraphes: string[]
    conseil_ouverture: string
    conseil_cloture: string
}

export interface JobInfoExtraction {
    company_name: string
    position_title: string
    location: string
    company_description: string
}

export interface JobOffer {
    id: string
    user_id: string
    company_name: string
    position_title: string
    job_description: string
    job_url: string | null
    location: string | null
    company_description: string | null
    status: 'not_sent' | 'applied' | 'interview' | 'rejected' | 'offer'
    tech_stack: string[]
    ai_analysis: JobAnalysis
    cover_letter: string | null
    user_notes: string | null
    application_date: string
    created_at: string
    updated_at: string
}

export interface UserProfile {
    id: string
    cv_text: string
    preferences: {
        remote_work: boolean
        salary_expectation?: string
        target_technologies: string[]
        career_goals?: string
    }
    created_at: string
    updated_at: string
}
