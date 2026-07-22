# NOVARIS - Application de Gestion Comptable et Commerciale

Application complète de gestion des documents commerciaux (Devis, Bon de Commande, Facture) pour NOVARIS.

## Fonctionnalités principales

✅ Gestion automatisée des Devis, Bons de Commande et Factures
✅ Numérotation automatique et unique pour chaque document
✅ Validation obligatoire du Responsable Financier
✅ Historique inaltérable de toutes les opérations
✅ Génération de documents PDF professionnels
✅ Gestion des utilisateurs et des rôles
✅ Calculs automatiques (TVA, remises, montants)
✅ Notifications en temps réel

## Stack Technologique

- **Backend** : Node.js + Express + PostgreSQL
- **Frontend** : React + TypeScript
- **Authentification** : JWT
- **Génération PDF** : PDFKit
- **Notifications** : EventEmitter

## Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Structure du projet

```
novaris-accounting-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── migrations/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
└── docs/
```

## Licence

Propriétaire - NOVARIS
