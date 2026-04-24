# Prompt Cursor : Remplir une fiche projet du portfolio

Utilise ce prompt **dans le workspace du projet à analyser** (pas dans le repo du portfolio). Ouvre le dépôt du projet (ex. ton repo e-commerce, ton app IA, etc.), colle le bloc ci-dessous dans le chat Cursor et précise **quel projet du portfolio** tu veux remplir (titre ou id).

---

## Prompt à copier

```
Tu es un développeur senior. J’ai un portfolio (autre repo) dont la présentation des projets est dans un fichier qui contient un tableau de projets. Chaque projet a cette structure TypeScript :

- id: string
- title: string
- category: "saas" | "dev" | "reseau"
- subCategory?: string
- description: string (courte, 1–2 phrases)
- problem: string (contexte / problème métier)
- solution: string (ce que l’app apporte)
- stack: string[] (technos, ex: React, Node, PostgreSQL)
- proof: [string, string, string] (3 preuves / points forts)
- demoUrl?: string
- githubUrl?: string
- appType?: string (ex: "Web App", "Dashboard", "API")
- stackBreakdown?: { frontend?: string[], backend?: string[], database?: string[], orm?: string[], auth?: string[], hosting?: string[] }
- problemContext?: { contexte?: string, situationInitiale?: string, utilisateurCible?: string }
- solutionFeatures?: string[] (liste de fonctionnalités)
- architecture?: { frontend?: string, backend?: string, database?: string, auth?: string, hosting?: string }
- challenges?: string[]
- technicalDecisions?: string[]
- impact?: string[]
- futureImprovements?: string[]
- demoVideo?: string
- demoLiveUrl?: string

**Mission :** Fouille ce projet (le repo actuellement ouvert) pour en extraire les infos réelles : package.json, README, structure des dossiers, code (front/back, BDD, auth, déploiement). Remplis **une seule** fiche projet au format ci-dessus.

**Quel projet remplir :** [À COMPLÉTER : indique le titre ou l’id du projet, ex. "E‑commerce vêtements" ou "id: 2" ou "IA enseignement microbiologie".]

**Contraintes :**
- Reste factuel : déduis du code et de la config, n’invente pas.
- description, problem, solution : phrases courtes et claires en français.
- stack et stackBreakdown : uniquement les technos réellement utilisées.
- proof : 3 éléments concrets (ex. "Authentification JWT", "API REST", "Déploiement Vercel").
- Si une info est introuvable, laisse une chaîne vide ou un tableau vide plutôt qu’inventer.

**Sortie attendue :** Donne-moi l’objet projet complet (JSON ou littéral TypeScript) prêt à coller dans le tableau du portfolio, ou applique les changements dans le fichier du portfolio si tu as accès au repo du portfolio. Sinon, fournis uniquement l’objet pour que je le remplace moi-même.
```

---

## Comment s’en servir

1. Ouvre dans Cursor **le repo du projet à décrire** (ex. ton app e-commerce, ton outil IA, etc.).
2. Copie le prompt ci-dessus dans le chat Cursor.
3. À la ligne **« Quel projet remplir »**, remplace par le titre ou l’id du projet correspondant dans ton portfolio (ex. `E‑commerce vêtements`, `id: 2`, `Prototype réseau`, `IA enseignement microbiologie`).
4. Lance la requête. Cursor va explorer le code (package.json, README, structure, config) et te renvoyer un objet projet rempli.
5. Dans le repo **portfolio** (iwbk), ouvre `src/components/panels/ProjectsPanel.tsx`, repère l’entrée du projet dans le tableau `projects`, et remplace-la par l’objet fourni (ou demande à Cursor de le faire si les deux repos sont accessibles).
6. Répète pour chaque projet en changeant à chaque fois le **« Quel projet remplir »** et en ouvrant le bon repo.

---

## Liste des projets du portfolio (référence)

| id | title |
|----|--------|
| 1 | Prototype réseau |
| 2 | E‑commerce vêtements |
| 3 | IA par inférence — cours par mail |
| 4 | Application de gestion d'entreprise |
| 5 | Gestion d'accès et structure réseau / applicatif |
| 6 | IA enseignement microbiologie |
| 7 | Portfolio |
| 8 | Application métier — cours, quizz, test et minijeu |

Categories : `saas` | `dev` | `reseau`. SubCategories possibles : `api`, `b2c`, `ia`, `outils`, `frontend`, etc.
