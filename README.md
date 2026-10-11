# Organisateur de Photos de Mariage

Ce programme permet d'identifier les personnes sur chaque photo de votre mariage et de les classer selon le moment de la journée (mairie, vin d'honneur, repas, soirée) en fonction de la date et heure de prise de vue.

## Prérequis

- Python 3.7 ou supérieur
- Les bibliothèques listées dans `requirements.txt`

## Installation

1. Clonez ce dépôt ou téléchargez les fichiers
2. Installez les dépendances:

```bash
pip install -r requirements.txt
```

## Structure des dossiers

```
mariage_photo_organizer/
├── data/
│   ├── reference_photos/    # Photos de référence pour l'identification
│   │   ├── pierre.jpg        # Une photo de référence par personne
│   │   ├── marie.jpg
│   │   └── ...
│   └── wedding_photos/       # Toutes les photos du mariage à traiter
│       ├── IMG_0001.jpg
│       ├── IMG_0002.jpg
│       └── ...
├── config/
│   └── moments_config.json   # Configuration des plages horaires
├── output/                   # Dossier de sortie (créé automatiquement)
│   ├── mairie/
│   ├── vin_d_honneur/
│   ├── repas/
│   └── soiree/
├── main.py                   # Script principal
└── requirements.txt
```

## Configuration

### Fichier moments_config.json

Le fichier `config/moments_config.json` contient la configuration des différents moments de la journée avec leurs plages horaires:

```json
{
    "moments": {
        "mairie": {
            "start_time": "10:00",
            "end_time": "12:00",
            "description": "Cérémonie à la mairie"
        },
        "vin_d_honneur": {
            "start_time": "12:30",
            "end_time": "14:00",
            "description": "Vin d'honneur"
        },
        "repas": {
            "start_time": "14:30",
            "end_time": "18:00",
            "description": "Repas"
        },
        "soiree": {
            "start_time": "19:00",
            "end_time": "02:00",
            "description": "Soirée"
        }
    }
}
```

**Personnalisez ces horaires selon votre propre planning!**

## Préparation des données

### Photos de référence

1. Créez un dossier `data/reference_photos/`
2. Ajoutez une photo par personne à identifier
3. **Nommez chaque fichier avec le nom de la personne** (ex: `pierre.jpg`, `marie.jpg`)
   - Le programme utilisera le nom du fichier comme nom de la personne
   - Vous pouvez utiliser des noms complets avec des espaces (ex: `pierre_martin.jpg`)

**Conseils pour de meilleurs résultats:**
- Utilisez des photos récentes où le visage est clairement visible
- Évitez les photos de groupe pour les références
- Préférez des photos en haute résolution
- Assurez-vous que la personne regarde la caméra

### Photos du mariage

1. Placez toutes vos photos dans `data/wedding_photos/`
2. Le programme traitera tous les fichiers `.jpg` dans ce dossier

**Important:** Les photos doivent contenir des métadonnées EXIF avec la date et heure de prise de vue. La plupart des appareils photo numériques et smartphones ajoutent ces informations automatiquement.

## Exécution

```bash
python main.py
```

## Résultats

### Organisation des photos

Le programme va:
1. Créer des sous-dossiers dans `output/` pour chaque moment de la journée
2. Copier chaque photo dans le dossier correspondant à son moment
3. Renommer les photos avec un timestamp pour un tri chronologique

### Fichiers d'information

Pour chaque photo traitée, un fichier texte `.txt` sera créé avec:
- Le nom original du fichier
- La date et heure de prise de vue
- Le moment identifié
- La liste des personnes reconnues avec leurs positions dans l'image

### Résumé

Un fichier `summary.json` sera généré dans le dossier `output/` avec:
- Le nombre total de photos traitées
- Le nombre de photos par moment
- Le nombre d'apparitions par personne
- Le nombre de photos avec des visages non identifiés

## Fonctionnement technique

### Reconnaissance faciale

Le programme utilise la bibliothèque `face-recognition` qui implémente des algorithmes de deep learning pour:
1. Détecter les visages dans les images
2. Extraire les caractéristiques faciales (encodages)
3. Comparer les encodages avec les photos de référence

### Classification temporelle

Pour chaque photo:
1. Extraction de la date/heure depuis les métadonnées EXIF
2. Si les métadonnées sont manquantes, utilisation de la date de modification du fichier
3. Comparaison avec les plages horaires configurées pour déterminer le moment

### Seuil de reconnaissance

Le programme utilise un seuil de tolérance de 0.6 pour la reconnaissance faciale:
- **Seuil bas (0.4-0.5)**: Plus de correspondances, mais risque de fausses identifications
- **Seuil élevé (0.6-0.7)**: Moins de fausses identifications, mais risque de manquer des correspondances

Vous pouvez modifier ce seuil dans le code source (`main.py`, ligne avec `tolerance=0.6`).

## Personnalisation avancée

### Modifier les plages horaires

Éditez le fichier `config/moments_config.json` pour adapter les horaires à votre mariage.

### Ajouter des moments supplémentaires

Ajoutez simplement de nouvelles entrées dans le fichier JSON:

```json
{
    "moments": {
        "mairie": {...},
        "vin_d_honneur": {...},
        "repas": {...},
        "soiree": {...},
        "lancer_de_bouquet": {
            "start_time": "17:00",
            "end_time": "17:30",
            "description": "Lancer de bouquet"
        }
    }
}
```

### Changer le seuil de reconnaissance

Dans `main.py`, modifiez la ligne:

```python
matches = face_recognition.compare_faces(
    self.known_face_encodings, 
    face_encoding,
    tolerance=0.6  # <-- Modifiez cette valeur
)
```

## Résolution des problèmes

### "Aucun visage détecté"

- Vérifiez que les photos de référence sont de bonne qualité
- Assurez-vous que le visage est bien visible et de face
- Essayez avec une autre photo de la même personne

### "Date: Inconnue"

- Vérifiez que vos photos contiennent des métadonnées EXIF
- Essayez d'ouvrir une photo avec un logiciel comme Exif Viewer pour confirmer
- Si les métadonnées sont manquantes, le programme utilisera la date de modification du fichier

### Erreurs de reconnaissance

- Augmentez le seuil de tolérance (ex: 0.7) pour réduire les fausses identifications
- Ajoutez plus de photos de référence pour chaque personne
- Assurez-vous que les photos de référence sont variées (différents angles, expressions)

### Performances

Le traitement peut être lent pour un grand nombre de photos:
- La reconnaissance faciale est gourmande en ressources
- Sur un ordinateur standard, comptez environ 1-2 secondes par photo
- Pour 1250 photos, prévoyez 20-50 minutes de traitement

## Exemple de sortie

```
Chargement des photos de référence depuis data/reference_photos...
  - pierre: 1 visage(s) chargé(s)
  - marie: 1 visage(s) chargé(s)
  - jean: 1 visage(s) chargé(s)
Total: 3 visages de référence chargés

Traitement des photos du mariage...

Traitement de IMG_0001.jpg...
  Date: 2023-07-15 11:30:45
  Moment: mairie
  Visages détectés: 2
    - pierre à (120, 250, 300, 180)
    - marie à (400, 200, 550, 350)

Traitement de IMG_0002.jpg...
  Date: 2023-07-15 13:45:22
  Moment: vin_d_honneur
  Visages détectés: 3
    - pierre à (150, 180, 320, 250)
    - jean à (400, 150, 550, 280)
    - Inconnu à (600, 200, 750, 300)

Traitement terminé. 1250 photos traitées.

Génération du résumé...

=== RÉSUMÉ ===
Total photos: 1250

Par moment:
  mairie: 50
  vin_d_honneur: 200
  repas: 800
  soiree: 200

Par personne:
  pierre: 450
  marie: 400
  jean: 300
  ...

Photos avec visages inconnus: 150
```

## Limitations

1. **Précision de la reconnaissance**: La reconnaissance faciale n'est pas parfaite, surtout avec des photos de groupe ou des angles défavorables.

2. **Métadonnées manquantes**: Si vos photos n'ont pas de métadonnées EXIF, la classification temporelle sera moins précise.

3. **Temps de traitement**: Le traitement de 1250 photos peut prendre du temps selon les performances de votre ordinateur.

4. **Mémoire**: Le programme charge tous les encodages faciaux en mémoire, ce qui peut être problématique pour un très grand nombre de personnes de référence.

## Contribuer

Les contributions sont les bienvenues! N'hésitez pas à:
- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
