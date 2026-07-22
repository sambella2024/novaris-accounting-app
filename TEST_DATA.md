# NOVARIS - Données de Test

## Utilisateurs Pré-créés

Après l'exécution des migrations, les utilisateurs suivants sont disponibles:

### 1. Administrateur Système
```
Nom: Admin System
Email: admin@novaris.mg
MotDePasse: admin123
Rôle: ADMIN
```

### 2. Agent Commercial
```
Nom: Jean Commercial
Email: jean@novaris.mg
MotDePasse: admin123
Rôle: COMMERCIAL
```

### 3. Responsable Financier
```
Nom: Paul Responsable
Email: paul@novaris.mg
MotDePasse: admin123
Rôle: RESPONSABLE_FINANCIER
```

## Produits de Test

| Référence | Désignation | Prix | Unité | Catégorie |
|-----------|-------------|------|-------|----------|
| PROD-001 | Ciment 50kg | 8500 | sac | Matériaux |
| PROD-002 | Fer 10mm | 12000 | mètre | Matériaux |
| PROD-003 | Sable | 5000 | m3 | Matériaux |
| PROD-004 | Brique | 200 | unité | Matériaux |
| PROD-005 | Tôle ondulée | 35000 | unité | Toiture |

## Client de Test

```
Nom: ABC Construction
Adresse: 456 Avenue de la Paix, Antananarivo
Téléphone: +261 20 22 22 22
Email: contact@abc.mg
NIF: NIF-ABC-001
Contact: Mr. André
```

## Scénario de Test Complet

### Étape 1: Connexion Commercial
1. Aller sur http://localhost:3000
2. Se connecter avec jean@novaris.mg / admin123
3. Aller à "Devis"
4. Cliquer "+ Nouveau Devis"

### Étape 2: Créer un Devis
1. Sélectionner le client "ABC Construction"
2. Ajouter 2 lignes:
   - Ciment 50kg: Quantité 10 → Montant HT: 85000
   - Fer 10mm: Quantité 50m → Montant HT: 600000
3. Total HT: 685000
4. TVA (20%): 137000
5. Total TTC: 822000
6. Cliquer "Créer le Devis"

### Étape 3: Validation RF
1. Se déconnecter et se connecter avec paul@novaris.mg / admin123
2. Aller à "Devis"
3. Trouver le devis créé
4. Cliquer "Valider"
5. Statut passe à "Validé"

### Étape 4: Transformation en BC
1. Cliquer "Transformer en BC"
2. Un nouveau BC est créé automatiquement
3. Référence BC: BC-2026-000001

### Étape 5: Validation et Transformation en Facture
1. Aller à "Bons de Commande"
2. Valider le BC
3. Transformer en Facture
4. Facture créée avec référence FAC-2026-000001

## Points de Vérification

✅ Numérotation correcte (DEV-, BC-, FAC-)
✅ Calculs TVA corrects (20%)
✅ Montants en lettres générés
✅ Historique enregistré pour chaque action
✅ PDF générable pour tous les documents
✅ Permissions respectées par rôle
✅ Transformation impossible sans validation RF

## Requêtes API de Test

### Créer un Devis
```bash
curl -X POST http://localhost:5000/api/devis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "client_id": "client-uuid",
    "date_devis": "2026-07-22",
    "date_livraison": "2026-08-22",
    "echeance": "2026-08-22",
    "lignes": [
      {
        "designation": "Ciment 50kg",
        "quantite": 10,
        "prix_unitaire": 8500,
        "remise": 0
      }
    ]
  }'
```

### Lister les Devis
```bash
curl -X GET http://localhost:5000/api/devis \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Valider un Devis
```bash
curl -X POST http://localhost:5000/api/devis/devis-uuid/validate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Transformer en BC
```bash
curl -X POST http://localhost:5000/api/devis/devis-uuid/transform-to-bc \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Télécharger PDF
```bash
curl -X GET http://localhost:5000/api/devis/devis-uuid/pdf \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o devis.pdf
```
