#!/usr/bin/env python3
"""
Programme d'identification des personnes et classification des photos de mariage.

Ce programme permet de:
1. Identifier les personnes sur chaque photo en utilisant la reconnaissance faciale
2. Classer les photos selon le moment de la journée (mairie, vin d'honneur, repas)
   en fonction de la date/heure de prise de vue
"""

import os
import json
import cv2
import face_recognition
import numpy as np
from datetime import datetime
from PIL import Image, ExifTags
from pathlib import Path
from typing import Dict, List, Tuple, Optional


class WeddingPhotoOrganizer:
    """Classe principale pour organiser les photos de mariage."""
    
    def __init__(self, reference_dir: str, wedding_dir: str, output_dir: str, config_path: str):
        """
        Initialise l'organisateur de photos.
        
        Args:
            reference_dir: Chemin vers le dossier des photos de référence
            wedding_dir: Chemin vers le dossier des photos du mariage
            output_dir: Chemin vers le dossier de sortie
            config_path: Chemin vers le fichier de configuration des moments
        """
        self.reference_dir = Path(reference_dir)
        self.wedding_dir = Path(wedding_dir)
        self.output_dir = Path(output_dir)
        self.config_path = Path(config_path)
        
        # Charger la configuration des moments
        self.moments_config = self._load_moments_config()
        
        # Créer les dossiers de sortie
        self._create_output_directories()
        
        # Charger les encodages des visages de référence
        self.known_face_encodings = []
        self.known_face_names = []
        self._load_reference_faces()
    
    def _load_moments_config(self) -> Dict:
        """Charge la configuration des moments depuis le fichier JSON."""
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            # Configuration par défaut si le fichier n'existe pas
            return {
                "moments": {
                    "mairie": {"start_time": "10:00", "end_time": "12:00"},
                    "vin_d_honneur": {"start_time": "12:30", "end_time": "14:00"},
                    "repas": {"start_time": "14:30", "end_time": "18:00"},
                    "soiree": {"start_time": "19:00", "end_time": "02:00"}
                }
            }
    
    def _create_output_directories(self):
        """Crée les dossiers de sortie pour chaque moment."""
        for moment in self.moments_config.get("moments", {}).keys():
            moment_dir = self.output_dir / moment
            moment_dir.mkdir(parents=True, exist_ok=True)
    
    def _load_reference_faces(self):
        """Charge les photos de référence et leurs encodages faciaux."""
        print(f"Chargement des photos de référence depuis {self.reference_dir}...")
        
        for ref_file in self.reference_dir.glob("*.jpg"):
            try:
                # Charger l'image
                image = face_recognition.load_image_file(str(ref_file))
                
                # Obtenir les encodages faciaux
                face_encodings = face_recognition.face_encodings(image)
                
                if len(face_encodings) > 0:
                    # Utiliser le nom du fichier comme nom de la personne
                    person_name = ref_file.stem
                    
                    # Ajouter chaque encodage trouvé
                    for encoding in face_encodings:
                        self.known_face_encodings.append(encoding)
                        self.known_face_names.append(person_name)
                    
                    print(f"  - {person_name}: {len(face_encodings)} visage(s) chargé(s)")
                else:
                    print(f"  - {ref_file.name}: Aucun visage détecté")
            except Exception as e:
                print(f"  - Erreur avec {ref_file.name}: {e}")
        
        print(f"Total: {len(self.known_face_names)} visages de référence chargés")
    
    def _get_photo_datetime(self, photo_path: Path) -> Optional[datetime]:
        """
        Extrait la date et l'heure de prise de vue depuis les métadonnées EXIF.
        
        Args:
            photo_path: Chemin vers la photo
            
        Returns:
            datetime: Date et heure de prise de vue, ou None si non disponible
        """
        try:
            # Ouvrir l'image avec PIL pour accéder aux métadonnées EXIF
            img = Image.open(photo_path)
            exif_data = img._getexif()
            
            if exif_data:
                # Chercher les tags de date/heure
                for tag_id, value in exif_data.items():
                    tag = ExifTags.TAGS.get(tag_id, tag_id)
                    
                    if tag == 'DateTimeOriginal':
                        # Format: "YYYY:MM:DD HH:MM:SS"
                        dt_str = value
                        dt = datetime.strptime(dt_str, "%Y:%m:%d %H:%M:%S")
                        return dt
                    
                    elif tag == 'DateTime':
                        dt_str = value
                        dt = datetime.strptime(dt_str, "%Y:%m:%d %H:%M:%S")
                        return dt
            
            # Si pas de métadonnées EXIF, utiliser la date de modification du fichier
            mtime = os.path.getmtime(photo_path)
            return datetime.fromtimestamp(mtime)
            
        except Exception as e:
            print(f"  - Impossible de lire la date pour {photo_path.name}: {e}")
            return None
    
    def _get_moment_from_datetime(self, dt: datetime) -> str:
        """
        Détermine le moment de la journée en fonction de l'heure.
        
        Args:
            dt: Date et heure de prise de vue
            
        Returns:
            str: Nom du moment (mairie, vin_d_honneur, repas, etc.)
        """
        hour = dt.hour
        minute = dt.minute
        current_time = f"{hour:02d}:{minute:02d}"
        
        for moment_name, moment_info in self.moments_config.get("moments", {}).items():
            start_time = moment_info.get("start_time", "00:00")
            end_time = moment_info.get("end_time", "23:59")
            
            if start_time <= current_time <= end_time:
                return moment_name
        
        return "inconnu"
    
    def _recognize_faces(self, image_path: Path) -> List[Tuple[str, Tuple]]:
        """
        Reconnaît les visages dans une image.
        
        Args:
            image_path: Chemin vers l'image à analyser
            
        Returns:
            List[Tuple[str, Tuple]]: Liste de tuples (nom, localisation)
        """
        try:
            # Charger l'image
            image = face_recognition.load_image_file(str(image_path))
            
            # Trouver les localisations des visages
            face_locations = face_recognition.face_locations(image)
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            results = []
            
            for face_encoding, face_location in zip(face_encodings, face_locations):
                # Comparer avec les visages connus
                matches = face_recognition.compare_faces(
                    self.known_face_encodings, 
                    face_encoding,
                    tolerance=0.6
                )
                
                name = "Inconnu"
                
                # Utiliser le premier match
                match_index = np.argmax(matches)
                if matches[match_index]:
                    name = self.known_face_names[match_index]
                
                results.append((name, face_location))
            
            return results
            
        except Exception as e:
            print(f"  - Erreur lors de la reconnaissance faciale pour {image_path.name}: {e}")
            return []
    
    def process_photos(self):
        """Traite toutes les photos du mariage."""
        print("\nTraitement des photos du mariage...")
        
        processed_count = 0
        
        for wedding_file in self.wedding_dir.glob("*.jpg"):
            print(f"\nTraitement de {wedding_file.name}...")
            
            # Obtenir la date/heure de la photo
            dt = self._get_photo_datetime(wedding_file)
            
            if dt:
                print(f"  Date: {dt.strftime('%Y-%m-%d %H:%M:%S')}")
                moment = self._get_moment_from_datetime(dt)
                print(f"  Moment: {moment}")
            else:
                moment = "inconnu"
                print("  Date: Inconnue")
            
            # Reconnaître les visages
            face_results = self._recognize_faces(wedding_file)
            
            if face_results:
                print(f"  Visages détectés: {len(face_results)}")
                for name, location in face_results:
                    print(f"    - {name} à {location}")
            else:
                print("  Aucun visage détecté")
            
            # Copier la photo dans le bon dossier
            moment_dir = self.output_dir / moment
            moment_dir.mkdir(parents=True, exist_ok=True)
            
            # Créer un nom de fichier avec les informations
            timestamp = dt.strftime("%Y%m%d_%H%M%S") if dt else "unknown"
            new_filename = f"{timestamp}_{wedding_file.name}"
            output_path = moment_dir / new_filename
            
            # Copier le fichier
            import shutil
            shutil.copy2(wedding_file, output_path)
            
            # Sauvegarder les informations de reconnaissance dans un fichier texte
            info_path = output_path.with_suffix(".txt")
            with open(info_path, 'w', encoding='utf-8') as f:
                f.write(f"Fichier: {wedding_file.name}\n")
                f.write(f"Date/Heure: {dt.strftime('%Y-%m-%d %H:%M:%S') if dt else 'Inconnue'}\n")
                f.write(f"Moment: {moment}\n")
                f.write("\nPersonnes identifiées:\n")
                for name, location in face_results:
                    top, right, bottom, left = location
                    f.write(f"  - {name} (x:{left}, y:{top}, largeur:{right-left}, hauteur:{bottom-top})\n")
            
            processed_count += 1
        
        print(f"\nTraitement terminé. {processed_count} photos traitées.")
    
    def generate_summary(self):
        """Génère un résumé de toutes les photos traitées."""
        print("\nGénération du résumé...")
        
        summary = {
            "total_photos": 0,
            "by_moment": {},
            "by_person": {},
            "photos_with_unknown_faces": 0
        }
        
        # Initialiser les compteurs
        for moment in self.moments_config.get("moments", {}).keys():
            summary["by_moment"][moment] = 0
        
        # Parcourir les fichiers de sortie
        for moment_dir in self.output_dir.iterdir():
            if moment_dir.is_dir():
                moment_name = moment_dir.name
                
                for file in moment_dir.glob("*.jpg"):
                    summary["total_photos"] += 1
                    
                    if moment_name in summary["by_moment"]:
                        summary["by_moment"][moment_name] += 1
                    else:
                        summary["by_moment"][moment_name] = 1
                    
                    # Lire les informations du fichier texte
                    txt_file = file.with_suffix(".txt")
                    if txt_file.exists():
                        with open(txt_file, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        # Compter les personnes
                        if "Personnes identifiées:" in content:
                            lines = content.split('\n')
                            for line in lines:
                                if line.startswith("  - ") and line != "  - Inconnu":
                                    person_name = line.split(')')[0].split('(')[0].strip().replace("  - ", "")
                                    summary["by_person"][person_name] = summary["by_person"].get(person_name, 0) + 1
                                elif line.startswith("  - Inconnu"):
                                    summary["photos_with_unknown_faces"] += 1
        
        # Sauvegarder le résumé
        summary_path = self.output_dir / "summary.json"
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        # Afficher le résumé
        print("\n=== RÉSUMÉ ===")
        print(f"Total photos: {summary['total_photos']}")
        print("\nPar moment:")
        for moment, count in summary["by_moment"].items():
            print(f"  {moment}: {count}")
        
        print("\nPar personne:")
        for person, count in sorted(summary["by_person"].items(), key=lambda x: x[1], reverse=True):
            print(f"  {person}: {count}")
        
        print(f"\nPhotos avec visages inconnus: {summary['photos_with_unknown_faces']}")
        
        return summary


def main():
    """Fonction principale."""
    # Chemins par défaut
    base_dir = Path(__file__).parent
    reference_dir = base_dir / "data" / "reference_photos"
    wedding_dir = base_dir / "data" / "wedding_photos"
    output_dir = base_dir / "output"
    config_path = base_dir / "config" / "moments_config.json"
    
    # Créer l'organisateur
    organizer = WeddingPhotoOrganizer(
        reference_dir=reference_dir,
        wedding_dir=wedding_dir,
        output_dir=output_dir,
        config_path=config_path
    )
    
    # Traiter les photos
    organizer.process_photos()
    
    # Générer le résumé
    organizer.generate_summary()
    
    print("\nToutes les opérations sont terminées!")


if __name__ == "__main__":
    main()
