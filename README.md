# DevSearch - Suivi de Stage & Analyseur IA

Application web moderne pour gérer vos candidatures de stage avec l'aide de l'intelligence artificielle.

## 🚀 Fonctionnalités

- **Tableau de bord** : Visualisez et gérez toutes vos candidatures
- **Analyse IA** : Analysez automatiquement la correspondance entre votre CV et les offres d'emploi
- **Génération de lettres** : Lettres de motivation personnalisées générées par l'IA
- **Conseils d'entretien** : Recommandations spécifiques pour chaque poste
- **Suivi de statut** : Suivez l'évolution de vos candidatures (Postulé, Entretien, Refusé, Offre)

## 🛠️ Stack Technique

- **Frontend** : Next.js 14, React, TypeScript, TailwindCSS
- **UI** : shadcn/ui components
- **Backend** : Supabase (PostgreSQL + Auth + Edge Functions)
- **IA** : OpenAI API (GPT-4o-mini)
- **Déploiement** : Vercel

## 📦 Installation

1. **Cloner le projet**
   ```bash
   cd /Users/keomalima/Downloads/devsearch
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créez un fichier `.env.local` à la racine du projet :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Configurer Supabase**
   
   - Créez un projet sur [Supabase](https://supabase.com)
   - Exécutez le script SQL dans `supabase/schema.sql` via l'éditeur SQL de Supabase
   - Activez l'authentification par email dans les paramètres

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrir l'application**
   
   Visitez [http://localhost:3000](http://localhost:3000)

## 🎯 Utilisation

1. **Créer un compte** : Inscrivez-vous avec votre email
2. **Configurer votre profil** : Ajoutez votre CV et vos préférences dans la page Profil
3. **Analyser une offre** : Collez une description de poste et laissez l'IA analyser
4. **Sauvegarder** : Enregistrez l'analyse dans votre tableau de bord
5. **Suivre vos candidatures** : Mettez à jour les statuts au fur et à mesure

## 📁 Structure du Projet

```
devsearch/
├── app/                      # Pages Next.js
│   ├── api/                  # API routes
│   ├── analyze/              # Page d'analyse
│   ├── offers/[id]/          # Détails d'une offre
│   ├── profile/              # Page de profil
│   └── page.tsx              # Dashboard
├── components/               # Composants React
│   ├── ui/                   # shadcn/ui components
│   ├── ApplicationTable.tsx
│   ├── AnalysisCard.tsx
│   ├── MatchRateGauge.tsx
│   └── StatusBadge.tsx
├── lib/                      # Utilitaires
│   ├── openai/               # Intégration OpenAI
│   ├── supabase/             # Clients Supabase
│   └── types.ts              # Types TypeScript
└── supabase/
    └── schema.sql            # Schéma de base de données
```

## 🔑 Configuration OpenAI

L'application utilise GPT-4o-mini pour l'analyse. Vous pouvez modifier le modèle dans `lib/openai/client.ts` si nécessaire.

## 🎨 Design

L'application utilise un thème sombre par défaut avec une esthétique moderne et minimaliste. Les composants sont construits avec shadcn/ui et TailwindCSS.

## 📝 License

MIT
