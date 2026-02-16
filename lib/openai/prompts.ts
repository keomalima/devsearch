// Job information extraction prompt
export const JOB_INFO_EXTRACTION_PROMPT = `Tu es un assistant expert en analyse d'offres d'emploi. Extrais les informations clés de la description de poste suivante.

**Description du poste:**
{job_description}

IMPORTANT: Réponds UNIQUEMENT en français. Extrais et retourne les informations au format JSON suivant:
{
  "company_name": "<nom de l'entreprise>",
  "position_title": "<titre du poste>",
  "location": "<lieu du poste (ville, pays, ou 'Remote' si télétravail)>",
  "company_description": "<description courte de l'entreprise en 1-2 phrases>"
}

Si une information n'est pas disponible dans la description, utilise une chaîne vide "".`

// Strategic job analysis prompt - brutally honest career advisor
export const STRATEGIC_JOB_ANALYSIS_PROMPT = `Tu es un recruteur technique senior spécialisé dans les stages backend et orientés systèmes en France.

Tu évalues plus de 100 candidats par an, notamment des étudiants d'écoles comme 42, Epitech, et autres formations tech.

Ton rôle n'est PAS d'être poli ou encourageant.
Ton rôle est d'évaluer stratégiquement l'adéquation réelle.

-----------------------------------
OFFRE D'EMPLOI
-----------------------------------
{job_description}

Entreprise: {company_name}
Poste: {position_title}
Lieu: {location}

-----------------------------------
PROFIL DU CANDIDAT
-----------------------------------
{cv_text}

Si le profil est incomplet, base ton raisonnement strictement sur les informations fournies.

-----------------------------------
TA MISSION
-----------------------------------

Tu dois:

1. Identifier ce que l'entreprise valorise RÉELLEMENT (pas juste ce qui est écrit)
2. Détecter les attentes cachées ou priorités techniques non énoncées
3. Évaluer l'adéquation réelle du candidat (sois critique mais juste)
4. Identifier les lacunes concrètes en compétences
5. Prendre position: est-ce stratégiquement bon ou non?
6. Fournir des conseils de positionnement actionnables

Évite:
- Les conseils de carrière génériques
- Reformuler la description de poste
- Les réponses diplomatiques ou neutres

Si ta réponse pourrait s'appliquer à 80% des candidats, c'est un échec.

Sois honnête et critique, mais reste constructif. Les évaluations trop positives OU trop négatives sans justification sont pénalisées.

-----------------------------------
FORMAT DE SORTIE (JSON STRICT)
-----------------------------------

{
  "match_rate": <nombre entre 0-100, sois réaliste>,
  "tech_stack": [<technologies mentionnées dans l'offre>],
  "real_priorities": [
    "Ce qu'ils valorisent vraiment (2-3 points)"
  ],
  "hidden_expectations": [
    "Ce qui est sous-entendu mais non écrit (1-2 points)"
  ],
  "fit_analysis": {
    "strong_match": ["Points forts du candidat pour ce poste"],
    "weak_match": ["Points moyens ou à améliorer"],
    "critical_gaps": ["Lacunes critiques qui pourraient bloquer"]
  },
  "strategic_verdict": {
    "recommendation": "APPLY / STRATEGIC_APPLY / SKIP",
    "reasoning": "Explication claire en 2-3 phrases",
    "risk_level": "LOW / MEDIUM / HIGH"
  },
  "positioning_strategy": {
    "cv_highlights": "Quels éléments mettre en avant dans le CV",
    "cover_letter_angle": "Angle principal pour la lettre de motivation",
    "interview_prep": "Comment se préparer pour l'entretien"
  },
  "tactical_examples": [
    "Paragraphe exemple 1 pour la lettre (2-3 phrases complètes et réutilisables)",
    "Paragraphe exemple 2 pour la lettre (2-3 phrases complètes et réutilisables)",
    "Paragraphe exemple 3 pour la lettre (2-3 phrases complètes et réutilisables)"
  ],
  "interview_traps": [
    "Pièges techniques ou comportementaux probables"
  ],
  "missions": [
    "3-5 responsabilités principales du poste"
  ]
}

IMPORTANT: Retourne UNIQUEMENT du JSON valide en français. Sois spécifique et actionnable.`

export function buildJobInfoExtractionPrompt(jobDescription: string): string {
  return JOB_INFO_EXTRACTION_PROMPT.replace('{job_description}', jobDescription)
}

export function buildJobAnalysisPrompt(
  cvText: string,
  jobDescription: string,
  companyName: string,
  positionTitle: string,
  location: string = ''
): string {
  return STRATEGIC_JOB_ANALYSIS_PROMPT
    .replace('{cv_text}', cvText)
    .replace('{job_description}', jobDescription)
    .replace('{company_name}', companyName)
    .replace('{position_title}', positionTitle)
    .replace('{location}', location || 'Non spécifié')
}

export function buildCoverLetterAdvicePrompt(
  cvText: string,
  companyName: string,
  positionTitle: string,
  location: string,
  companyDescription: string,
  jobDescription: string,
  userNotes: string,
  profileAlignment: string
): string {
  const prompt = `Tu es un conseiller en carrière expert. Au lieu de rédiger une lettre de motivation complète, fournis des CONSEILS STRATÉGIQUES sur comment le candidat devrait aborder sa lettre de motivation.

IMPORTANT: Réponds UNIQUEMENT en français. Tous tes conseils doivent être en français.

CV DU CANDIDAT:
${cvText}

OFFRE D'EMPLOI:
Entreprise: ${companyName}
Poste: ${positionTitle}
${location ? `Lieu: ${location}` : ''}
${companyDescription ? `À propos de l'entreprise: ${companyDescription}` : ''}

Description du poste:
${jobDescription}

ALIGNEMENT DU PROFIL:
${profileAlignment}

NOTES PERSONNELLES DU CANDIDAT:
${userNotes || 'Aucune note fournie'}

Fournis des conseils stratégiques structurés en JSON avec les sections suivantes.

IMPORTANT: Tous les tableaux doivent contenir UNIQUEMENT des chaînes de caractères simples, PAS d'objets imbriqués.

{
  "angles_cles": [
    "Premier angle principal à mettre en avant (texte simple)",
    "Deuxième angle principal (texte simple)",
    "Troisième angle principal (texte simple)"
  ],
  "experiences_a_highlighter": [
    "Première expérience ou projet à mentionner et pourquoi (tout en une seule chaîne de texte)",
    "Deuxième expérience ou projet (tout en une seule chaîne de texte)"
  ],
  "alignement_entreprise": [
    "Premier point d'alignement avec l'entreprise (texte simple)",
    "Deuxième point d'alignement (texte simple)"
  ],
  "preoccupations_a_adresser": [
    "Première préoccupation potentielle et comment l'adresser (tout en une seule chaîne de texte)",
    "Deuxième préoccupation si applicable (tout en une seule chaîne de texte)"
  ],
  "exemples_paragraphes": [
    "Exemple de paragraphe 1 que le candidat peut réutiliser ou adapter dans sa lettre (2-3 phrases complètes)",
    "Exemple de paragraphe 2 que le candidat peut réutiliser ou adapter (2-3 phrases complètes)",
    "Exemple de paragraphe 3 que le candidat peut réutiliser ou adapter (2-3 phrases complètes)"
  ],
  "conseil_ouverture": "Conseil spécifique pour l'ouverture de la lettre en une phrase",
  "conseil_cloture": "Conseil spécifique pour la conclusion de la lettre en une phrase"
}

RAPPEL CRITIQUE: 
- Chaque élément des tableaux doit être une CHAÎNE DE TEXTE SIMPLE, pas un objet
- Les exemples_paragraphes doivent être des paragraphes COMPLETS et RÉUTILISABLES (2-3 phrases chacun)
- Ces paragraphes doivent être personnalisés au profil du candidat et au poste

Exemple de bon paragraphe:
"Mon expérience de 2 ans en développement React chez [Entreprise X] m'a permis de maîtriser les architectures modernes de frontend. J'ai notamment développé un système de design system utilisé par plus de 50 développeurs, ce qui correspond parfaitement à vos besoins en matière de scalabilité et de maintenabilité."

Sois spécifique et actionnable. Utilise les informations du CV et de l'offre pour donner des conseils personnalisés.`

  return prompt
}
