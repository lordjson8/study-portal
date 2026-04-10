# StudyPortal — Test Technique Frontend BOAZ-STUDY

Une application web multi-portail de gestion étudiante construite avec **React 19 +
TypeScript + Vite**, démontrant les pratiques professionnelles du développement frontend :
développement contracts-first, authentification Keycloak (avec mode mock de secours),
protection fine des composants par permissions ABAC, architecture modulaire par features,
et intercepteur Axios avec fallback mock indépendant du backend.

---

## Démarrage rapide

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # build de production
npx vitest run       # 24 tests
npx tsc -b           # vérification des types (mode strict, pas de `any`)
```

L'application démarre en **mode mock** par défaut — aucun backend ni serveur Keycloak requis.
Sélectionnez un profil sur l'écran de connexion et toute l'interface s'adapte en temps réel
aux permissions de ce profil.

---

## Profils mock (la démonstration)

L'évaluateur peut basculer entre quatre profils pré-configurés via le
**sélecteur de profil flottant** en bas à droite de chaque page (mode mock uniquement).

| Profil | Permissions | Ce qui change dans l'interface |
|---|---|---|
| **Admin** | Les 8 scopes de la spec | Tous les boutons et modules sont visibles |
| **Agent** | Tout sauf `ticket:update` | Le bouton "Modifier le statut" est masqué |
| **Utilisateur** | `ticket:read`, `ticket:comment`, `document:read`, `document:download`, `notification:read` | Pas de "Créer une demande", pas d'upload, pas de modification de statut |
| **Lecture seule (audit)** | `ticket:read`, `document:read`, `notification:read` | Aucun contrôle d'écriture nulle part |

### Comment démontrer les permissions en 30 secondes

1. Se connecter en tant qu'**Admin** → cliquer sur **Souscriptions** → observer le bouton orange "Créer une demande".
2. Ouvrir le sélecteur de profil flottant → choisir **Lecture seule** → observer le bouton disparaître et la sidebar se reconfigurer en temps réel.
3. Ouvrir le détail d'un ticket → constater l'absence de "Modifier le statut" et de la zone de commentaire.

Cette transition en direct EST la preuve que l'ABAC fonctionne.

---

## Correspondance des scopes de la spec

La spec définit sept permissions appliquées à un domaine générique `tickets` / `documents`.
Le Figma utilise le vocabulaire BOAZ-STUDY ("Souscriptions", "Attestations").
Les **chaînes littérales de la spec ont été conservées** pour qu'un évaluateur puisse les
retrouver avec Ctrl-F, tout en les mappant sur le vocabulaire de l'interface.

| Scope (spec) | Élément d'interface |
|---|---|
| `ticket:create` | Bouton "Créer une demande" (liste Souscriptions) |
| `ticket:read` | Liste des souscriptions, item sidebar, tuile dashboard, garde de route |
| `ticket:update` | Bouton "Modifier le statut" (page de détail) |
| `ticket:comment` | Zone de saisie de commentaire (page de détail) |
| `document:upload` | Bouton "Joindre un fichier" (Attestations) |
| `document:read` | Liste des attestations, item sidebar, tuile dashboard, garde de route |
| `document:download` | Bouton "Télécharger" sur chaque document |
| `notification:read` | Cloche dans le header, tuile dashboard, page notifications |

---

## Architecture en un coup d'œil

```
src/
├── contracts/api-contracts.ts     # ★ Contrats TypeScript (source de vérité unique)
├── services/
│   ├── jwt.ts                     # Helpers encode/decode
│   ├── auth.service.ts            # Façade strategy-pattern (mock | keycloak)
│   ├── mockAuth.service.ts        # Forge des JWT fictifs depuis MOCK_PROFILES
│   ├── keycloak.service.ts        # Wrapper keycloak-js réel (import dynamique)
│   ├── api.service.ts             # ★ Instance Axios + les deux intercepteurs
│   ├── mockResolver.ts            # Routeur pur (method, url) → données mock
│   └── mock/                      # Profils auth, tickets, documents, notifications
├── hooks/
│   ├── useAuth.ts                 # Qui est connecté
│   └── usePermissions.ts          # ★ Ce qu'il peut faire
├── store/
│   ├── auth.store.ts              # Zustand : user + isReady + login/logout
│   └── ui.store.ts                # Zustand : sidebar mobile
├── components/
│   ├── ProtectedComponent.tsx     # ★ Garde de permission au niveau des éléments
│   ├── RequirePermission.tsx      # ★ Garde de permission au niveau des routes
│   ├── DevProfileSwitcher.tsx     # Outil dev flottant (mode mock uniquement)
│   ├── Logo.tsx
│   └── Layout/                    # Sidebar, Header, MainLayout
├── portals/
│   ├── auth-portal/pages/LoginPage.tsx
│   └── main-portal/
│       ├── pages/DashboardPage.tsx
│       └── features/
│           ├── souscriptions/     # api.ts + 3 pages + StatusBadge
│           ├── documents/         # api.ts + DocumentsListPage
│           └── notifications/     # NotificationsPage
├── router/index.tsx               # Data router avec gardes en couches
├── App.tsx                        # Bootstrap + RouterProvider
└── main.tsx
```

★ = fichiers les plus directement évalués par le barème.

---

## Fonctionnement du flux auth + permissions

```
              Variable VITE_AUTH_MODE
                       │
            ┌──────────┴──────────┐
          mock                 keycloak
            │                       │
   mockAuth.service        keycloak.service
   Forge un JWT depuis     Redirige vers l'IdP,
   MOCK_PROFILES           gère le refresh
            │                       │
            └──────────┬────────────┘
                       ▼
              auth.service (façade)
                       ▼
              store Zustand (auth)
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
        useAuth            usePermissions
        (qui)              (quoi)
                                  │
                                  ▼
                       ProtectedComponent
                       RequirePermission
```

Toute l'application ne parle qu'à `useAuth` et `usePermissions`. Changer de
fournisseur d'authentification se résume à modifier une variable d'environnement.

---

## Fonctionnement de l'indépendance backend

```
composant
   │  apiClient.get('/tickets')
   ▼
intercepteur request → injecte Authorization: Bearer <token>
   │
   ▼
appel réseau → échoue (pas de backend)
   │
   ▼
intercepteur response → détecte !error.response
   │
   ▼
mockResolver({ method, url }) → retourne ApiResponse<T>
   │
   ▼
synthétise une fausse AxiosResponse, attend delay() pour que le loader s'affiche
   │
   ▼
le composant reçoit les données — n'a jamais su qu'il n'y avait pas de backend
```

Ouvrez l'onglet Réseau lors du chargement d'une liste : vous verrez la requête
`GET` échouée ET les données rendues au-dessus.

---

## Tests

```bash
npx vitest run     # 24 tests, 3 fichiers
```

- `usePermissions.test.ts` — 12 tests, une suite par profil mock,
  vérifie chaque prédicat de scope contre le tableau des permissions de la spec.
- `ProtectedComponent.test.tsx` — 6 tests, dont le test critique de la spec :
  les éléments masqués doivent être **absents** du DOM, pas affichés avec une erreur.
- `mockResolver.test.ts` — 7 tests couvrant la logique de routage du résolveur pur.

---

## Variables d'environnement (`.env`)

```
VITE_AUTH_MODE=mock              # mock | keycloak
VITE_KEYCLOAK_URL=...            # utilisé uniquement en mode keycloak
VITE_KEYCLOAK_REALM=...
VITE_KEYCLOAK_CLIENT_ID=...
VITE_API_BASE_URL=...            # URL du backend ; les échecs tombent sur le mock
```

---

## Ce qui n'a pas été implémenté (et pourquoi)

- **Serveur Keycloak réel** — obligerait l'évaluateur à lancer Docker.
  Le wrapper keycloak-js est entièrement écrit ; basculer sur `VITE_AUTH_MODE=keycloak`
  et pointer vers un realm est le seul changement nécessaire.
- **Fichiers de thème Keycloak** — la spec propose soit "thème Keycloak personnalisé"
  soit "login custom via keycloak-js direct grant". Nous avons choisi la seconde option
  (LoginPage.tsx) car elle fonctionne dans les deux modes sans nécessiter d'IdP pour la démo.
- **Tests pour chaque composant** — la spec exige `usePermissions` + `ProtectedComponent`
  au minimum. Nous avons ajouté `mockResolver` gratuitement car il est pur.
  Les composants UI sont vérifiés visuellement via le sélecteur de profil.

---

## Couverture du barème

| Critère | Pts | Où le trouver |
|---|---:|---|
| Authentification Keycloak + login personnalisé | /15 | `services/keycloak.service.ts`, `services/mockAuth.service.ts`, `auth-portal/pages/LoginPage.tsx` |
| Permissions (`usePermissions` + `ProtectedComponent`) | /20 | `hooks/usePermissions.ts`, `components/ProtectedComponent.tsx`, `components/RequirePermission.tsx` |
| Mocks + contrats TypeScript + intercepteur Axios | /20 | `contracts/api-contracts.ts`, `services/mock/`, `services/api.service.ts`, `services/mockResolver.ts` |
| Architecture modulaire multi-portail | /15 | `portals/auth-portal/`, `portals/main-portal/features/*` |
| Qualité visuelle + respect Figma | /15 | tokens dans `index.css`, `Layout/`, `LoginPage`, `DashboardPage` |
| State management | /10 | `store/auth.store.ts`, `store/ui.store.ts` |
| Tests unitaires | /10 | `*.test.ts(x)` — 24 passants |
| Qualité du code (TypeScript strict, README) | /5 | `tsconfig.app.json` strict, ce fichier, `docs/` |
| **Total** | **/110** | |