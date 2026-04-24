# Rapport — Page de présentation « Moi »

**Document** : Fonctionnement et contenu du panel Moi  
**Composant** : `MePanel` (`src/components/panels/MePanel.tsx`)  
**Contexte** : Section « Moi » du portfolio, affichée dans le `DetailPanel` lorsque l’utilisateur choisit la section correspondante.

---

## 1. Objectif et contexte

La page **Moi** est la présentation personnelle et professionnelle du candidat. Elle vise à ce qu’un recruteur comprenne rapidement :

- **Qui** : identité et rôle (Shuan HUYNH, développeur fullstack orienté produit).
- **Quoi** : compétences, façon de travailler, types de livrables.
- **Comment** : posture (contraintes, mode opératoire).
- **Où aller** : ce qu’il cherche et ce qu’il apporte.

Le panel utilise le **thème sombre** du portfolio et les **mêmes codes couleurs** que le panel Projets (bleu, vert, orange, violet) pour la cohérence visuelle et une bonne lisibilité.

---

## 2. Comportement et intégration

### Affichage

- Le panel Moi n’est **pas** une route dédiée : il s’affiche **à l’intérieur du DetailPanel** lorsque `section.id === "me"`.
- Le conteneur parent applique la classe **`detail-panel-me-active`** sur le `detail-panel-wrap`, ce qui active les styles sombres et les couleurs du panel Moi.
- Le contenu du panel est **scrollable** (overflow sur le corps de la carte) ; tout le contenu est dans un seul flux vertical.

### Navigation

- L’utilisateur arrive sur la section Moi depuis le carrousel / la navigation principale (ex. « Moi » dans les sections).
- Le bouton **Retour** du DetailPanel (en haut à droite) permet de fermer le panel et de revenir à la vue précédente ; il est géré par le parent (`onBack`), pas par `MePanel`.

### Données

- Tout le **contenu textuel et structurel** est défini **en dur** dans le composant (constantes `HERO`, `PRODUCT_CARDS`, `TIMELINE`, `FINAL_SEEK`, `FINAL_PILLS`, `FINAL_BRING`).
- Aucun appel API ni state métier : le panel est entièrement **statique** côté données.

---

## 3. Structure de la page (sections)

La page est découpée en **4 blocs principaux**, de haut en bas.

| Section | Rôle | Contenu principal |
|--------|------|-------------------|
| **1 — Hero** | Identité et positionnement | Nom, sous-titre, phrase d’accroche, badges (Fullstack, SaaS, etc.), stats (Projets concrets, Approche produit, etc.) |
| **2 — Fiche produit** | Profil « Shuan v1.0 » | 4 cartes en grille 2×2 : Capabilities, Constraints, Operating Mode, Outputs |
| **3 — Timeline** | Parcours / vision | 4 étapes chronologiques avec titre + texte (support terrain → construction d’outils → SaaS → vision actuelle) |
| **4 — Ce que je cherche** | Intentions et valeur | Titre, paragraphe de recherche, pills (Problèmes concrets, etc.), bloc « Ce que j’apporte » avec badges |

Un titre masqué **« Shuan v1.0 »** (classe `visually-hidden`) est associé à la section 2 pour l’accessibilité.

---

## 4. Contenu détaillé

### 4.1 Hero

- **Titre** : `Shuan HUYNH`
- **Sous-titre** : `Développeur fullstack orienté produit`
- **Micro** : `Je construis des outils, des SaaS et des interfaces utiles, pensés pour résoudre de vrais problèmes.`
- **Badges** : Fullstack, SaaS, IA appliquée, Autodidacte
- **Stats** (4 libellés) : Projets concrets, Approche produit, UX pragmatique, Livraison rapide

### 4.2 Fiche produit (4 cartes)

1. **Capabilities**  
   - Conception d’interfaces interactives  
   - Développement d’outils métier  
   - Architecture front propre  
   - Mise en forme produit / présentation  

2. **Constraints**  
   - Je préfère résoudre un vrai problème plutôt que produire du décor  
   - Je privilégie la clarté à la complexité inutile  
   - Je cherche des systèmes maintenables  

3. **Operating Mode**  
   - Comprendre le besoin réel  
   - Structurer vite  
   - Prototyper proprement  
   - Itérer avec retour terrain  

4. **Outputs**  
   - Interfaces utiles  
   - SaaS / dashboards  
   - Outils internes  
   - Expériences interactives différenciantes  

Chaque carte a un **slug** (`capabilities`, `constraints`, `operating`, `outputs`) utilisé pour la bordure colorée (voir Design).

### 4.3 Timeline (4 étapes)

1. **Support terrain / compréhension métier**  
   Le contact avec les usages réels m’a appris à penser en termes de besoins, de contraintes et de fiabilité.  

2. **Construction d’outils**  
   J’ai commencé à développer mes propres interfaces pour mieux structurer, automatiser et simplifier.  

3. **SaaS / produits interactifs**  
   J’ai progressivement conçu des projets orientés produit, avec plus d’attention à l’UX, à la clarté et à la logique métier.  

4. **Vision actuelle**  
   Je veux construire des produits utiles, bien pensés, crédibles techniquement et agréables à utiliser.  

### 4.4 Ce que je cherche

- **Paragraphe** : *« Je cherche à rejoindre ou collaborer avec des environnements où je peux concevoir, améliorer et faire évoluer des produits concrets : SaaS, outils internes, interfaces métier, expériences web utiles. »*
- **Pills** : Problèmes concrets, Produits utiles, Évolution continue  
- **Ce que j’apporte** (4 badges) : vision produit, sens du concret, exécution rapide, envie d’apprendre et d’itérer  

---

## 5. Design et couleurs

- **Thème** : fond sombre, texte clair, bordures légères. Cohérent avec le reste du portfolio.
- **Palette** (alignée panel Projets) :
  - **Bleu** : hero (dégradé), badges principaux, carte Outputs, stats, timeline (ligne + points), bloc final.
  - **Vert** : badges type « Autodidacte », carte Capabilities (bordure gauche), pills finales.
  - **Orange** : carte Constraints (bordure gauche), badges « Ce que j’apporte ».
  - **Violet** : badges « IA appliquée », carte Operating Mode (bordure gauche), pills et dégradés du bloc final.

Éléments marquants :

- **Hero** : fond en dégradé bleu très léger, bordure et ombre légère.
- **Cartes** : bordure gauche colorée (3px) selon le slug (vert / orange / violet / bleu).
- **Timeline** : ligne verticale en dégradé bleu → violet ; points bleus avec léger halo.
- **Bloc final** : dégradé bleu/violet très discret, pills et badges colorés, label « Ce que j’apporte » en petit uppercase.

Objectif : **lisibilité** (contraste, hiérarchie) et **cohérence** avec la section Projets.

---

## 6. Animations et interactivité

- **Bibliothèque** : `@react-spring/web` (composants `animated.*`).
- **Respect de la préférence utilisateur** : `useReducedMotion()` (media `prefers-reduced-motion: reduce`) ; si activé, les animations sont désactivées (duration 0, delay 0).

Effets utilisés :

- **Hero** : apparition en fondu + léger translateY (delay 80 ms).
- **Cartes** : apparition en fondu + translateY, avec délais décalés (200, 280, 360, 440 ms).
- **Timeline** : chaque étape apparaît en fondu + translateX, délais (500 à 800 ms).
- **Bloc « Ce que je cherche »** : fondu simple (delay 750 ms).

Au survol, les **cartes** (section 2) ont un léger effet « glow » (translateY, ombre, bordure) ; désactivé si `prefers-reduced-motion: reduce`.

---

## 7. Architecture technique

### Composant

- **Nom** : `MePanel`.
- **Fichier** : `src/components/panels/MePanel.tsx`.
- **Props** : aucune. Le composant est autonome pour le contenu et le rendu.

### Données

- Constantes en tête de fichier : `HERO`, `PRODUCT_CARDS`, `TIMELINE`, `FINAL_SEEK`, `FINAL_PILLS`, `FINAL_BRING`.
- `PRODUCT_CARDS` : tableau d’objets `{ slug, title, items[] }` pour la grille de cartes.
- `TIMELINE` : tableau d’objets `{ title, text }`.

### Rendu

- Racine : `div.me-panel-root` (flex column, pleine largeur).
- Chaque section est un `section` ou `animated.section` avec des classes dédiées (`me-panel-hero`, `me-panel-card`, `me-panel-timeline`, `me-panel-final`, etc.).
- Cartes en grille Bootstrap `row` / `col-12 col-sm-6` (2 colonnes à partir de `sm`).

### Intégration dans l’app

- Dans `DetailPanel`, si `section.id === "me"`, le corps affiche :  
  `{ section.id === "me" && <MePanel /> }`
- Les styles du panel Moi sont dans `globals.css` (bloc « Panel Moi (MePanel) » et `detail-panel-me-active`).

---

## 8. Résumé

| Aspect | Détail |
|--------|--------|
| **Rôle** | Présentation personnelle et professionnelle (identité, compétences, posture, recherche). |
| **Contenu** | 100 % statique (constantes dans le composant). |
| **Sections** | Hero → Fiche produit (4 cartes) → Timeline (4 étapes) → Ce que je cherche + Ce que j’apporte. |
| **Design** | Thème sombre, palette bleu / vert / orange / violet alignée avec le panel Projets, bon contraste. |
| **Animations** | Apparition en fondu/translate (react-spring), respect de `prefers-reduced-motion`. |
| **Intégration** | Affiché dans `DetailPanel` lorsque la section « Moi » est sélectionnée. |

Le panel Moi fonctionne comme une **page de présentation unique**, entièrement contenue dans `MePanel`, sans état ni chargement externe, avec une structure et un contenu pensés pour une lecture rapide par un recruteur.
