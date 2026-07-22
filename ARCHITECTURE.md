# Architecture NOVARIS

## Stack Technologique

```
┌─────────────────────────────────────────────┐
│          Frontend (React + Vite)            │
│  ┌──────────────────────────────────────┐   │
│  │  Login Page                          │   │
│  │  Dashboard                           │   │
│  │  Devis Management                    │   │
│  │  BC Management                       │   │
│  │  Invoice Management                  │   │
│  └──────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────┐
│       Backend (Express + TypeScript)        │
│  ┌──────────────────────────────────────┐   │
│  │  Authentication (JWT)                │   │
│  │  Routes & Controllers                │   │
│  │  Business Logic Services             │   │
│  │  PDF Generation                      │   │
│  │  Numeration Service                  │   │
│  │  Historique Service                  │   │
│  └──────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │ SQL
┌──────────────────▼──────────────────────────┐
│         Database (PostgreSQL)               │
│  ┌──────────────────────────────────────┐   │
│  │  Users / Clients                     │   │
│  │  Products Catalog                    │   │
│  │  Devis + Lignes                      │   │
│  │  Bons Commande + Lignes              │   │
│  │  Invoices + Lignes                   │   │
│  │  Historique (Audit Trail)            │   │
│  │  Parameters                          │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Flux de Transformation des Documents

```
                    ┌──────────────────┐
                    │  AGENT COMMERCIAL│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   CREER DEVIS    │
                    │  (BROUILLON)     │
                    └────────┬─────────┘
                             │
                             ▼
         ┌──────────────────────────────────┐
         │  VALIDATION RESPONSABLE FINANCIER│
         │  ☐ Validé  [Date] [Signature]    │
         └────────┬───────────────────────┘
                  │ OK
                  ▼
         ┌──────────────────────────────────┐
         │  BON DE COMMANDE (auto-généré)   │
         │  • Nouveau numéro                │
         │  • Nouvelle référence BC         │
         │  • Infos client reprises         │
         └────────┬───────────────────────┘
                  │
                  ▼
         ┌──────────────────────────────────┐
         │  VALIDATION RESPONSABLE FINANCIER│
         │  ☐ Validé  [Date] [Signature]    │
         └────────┬───────────────────────┘
                  │ OK
                  ▼
         ┌──────────────────────────────────┐
         │    FACTURE (auto-généré)         │
         │  • Nouveau numéro                │
         │  • Nouvelle référence FAC        │
         │  • Infos client reprises         │
         └───────��┬───────────────────────┘
                  │
                  ▼
         ┌──────────────────────────────────┐
         │     ARCHIVAGE / PAIEMENT         │
         └──────────────────────────────────┘
```

## Numérotation Automatique

```
DEVIS:        DEV-2026-000001, DEV-2026-000002, ...
BON COMMANDE: BC-2026-000001, BC-2026-000002, ...
FACTURE:      FAC-2026-000001, FAC-2026-000002, ...
```

## Historique des Opérations

Chaque action crée automatiquement une entrée inaltérable:

```
10/06/2026 10:30  │ Création du devis        │ Jean      │ DEV-2026-000001
11/06/2026 14:15  │ Modification du devis    │ Jean      │ DEV-2026-000001
12/06/2026 09:00  │ Validation RF            │ Paul      │ DEV-2026-000001
12/06/2026 09:05  │ Transformation en BC     │ Paul      │ BC-2026-000001
15/06/2026 16:30  │ Transformation en FAC    │ Paul      │ FAC-2026-000001
```

## Permissions par Rôle

### ADMIN
- ✅ Accès à tous les documents
- ✅ Gestion des utilisateurs
- ✅ Gestion des paramètres
- ✅ Modification de tous les documents
- ✅ Accès à tous les historiques

### COMMERCIAL
- ✅ Créer un devis
- ✅ Modifier un devis (non validé)
- ✅ Imprimer un devis
- ✅ Demander validation
- ❌ Transformer les documents
- ❌ Valider les documents

### RESPONSABLE_FINANCIER
- ✅ Consulter tous les documents
- ✅ Valider les transformations
- ✅ Transformer les documents
- ✅ Consulter les historiques
- ✅ Générer les rapports
- ❌ Créer directement les documents

## Format Final

**APPLICATION WEB WINDOWS NATIVE**

- Executable standalone sur Windows
- Pas de dépendances externes
- Base de données PostgreSQL locale intégrée
- Interface web responsive
- Génération PDF native
- Compatible avec imprimantes locales
- Exports PDF prêts à imprimer

### Déploiement

1. **Development**: `npm run dev` (backend + frontend)
2. **Production**: Build complet avec bundling
3. **Packaging**: Electron/NW.js pour créer executables Windows
