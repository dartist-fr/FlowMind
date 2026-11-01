# FlowMind

**Décris. Construis. Automatise.**  
Open-source workflow automation for everyone.

FlowMind est une interface de workflows responsive, disponible sur le web et sous forme d’application Android. Le projet est un **MVP** : les workflows sont sauvegardés localement dans le navigateur sur l’appareil utilisé et le bouton **Tester** lance une simulation. Aucune intégration externe ni action réelle n’est exécutée.

## Essayer FlowMind

- **Version web :** https://dartist-fr.github.io/FlowMind/
- **Dernière Release stable vérifiée :** [FlowMind 0.1.0](https://github.com/dartist-fr/FlowMind/releases/tag/v0.1.0)
- **APK Android 0.1.0 :** [Télécharger FlowMind-v0.1.0.apk](https://github.com/dartist-fr/FlowMind/releases/download/v0.1.0/FlowMind-v0.1.0.apk)
- **Toutes les versions :** https://github.com/dartist-fr/FlowMind/releases
- **Code source :** https://github.com/dartist-fr/FlowMind

Les builds automatiques de la branche `main` peuvent être publiés dans une Release `nightly` préliminaire. Pour une installation plus stable, privilégie une version taguée et consulte ses notes de publication.

## Développement local

Prérequis : Node.js 22 ou plus récent.

```bash
git clone https://github.com/dartist-fr/FlowMind.git
cd FlowMind
npm install
npm run dev
```

Pour vérifier le build de production :

```bash
npm run build
npm run preview
```

## Déploiement web

Le workflow `.github/workflows/pages.yml` construit l’application et la publie sur GitHub Pages à chaque push sur `main`. Le workflow de CI effectue les contrôles configurés dans `.github/workflows/ci.yml`.

## Application Android

Le workflow `.github/workflows/android-release.yml` :
- utilise Node.js 22 et Java 21 ;
- construit l’application web ;
- génère le projet Android avec Capacitor ;
- synchronise les ressources web ;
- compile un APK debug ;
- publie l’APK comme artefact et dans une Release.

Le workflow s’exécute sur les pushes de `main`, les tags `v*) et les lancements manuels. Les builds de la branche principale alimentent la Release préliminaire `nightly` ; un tag versionné déclenche une Release correspondante.

**Important :** l’APK produit par le workflow actuel est un APK debug destiné aux essais et à l’installation manuelle. Ce n’est pas un APK de production signé pour une publication sur Google Play.

## État du MVP

Fonctions documentées dans la version actuelle :

- tableau de bord responsive, recherche et filtres ;
- création, modification et suppression de workflows ;
- sauvegarde locale dans le navigateur de l’appareil ;
- nombre d’étapes, description et statut modifiables ;
- historique local des simulations, avec indication qu’aucune action externe n’a été exécutée ;
- paramètres locaux permettant de consulter ou d’effacer les données de l’appareil ;
- déploiement web et empaquetage Android automatisés.

**Limites connues :**

- pas de compte ni de synchronisation entre appareils ;
- pas d’éditeur visuel de nœuds opérationnel ;
- pas de moteur d’exécution réel ;
- pas d’intégrations externes exécutées ;
- pas d’assistant IA opérationnel ;
- le bouton **Tester** enregistre uniquement une simulation locale.

Les entrées d’interface qui présentent des fonctions non implémentées ne doivent pas être interprétées comme des intégrations disponibles.

## Sécurité et données

Les workflows et l’historique décrits dans ce MVP sont conservés localement sur l’appareil. Ne stocke pas de mots de passe, clés API ou autres secrets dans les workflows ou les journaux. Une simulation ne signifie jamais qu’une action externe a réellement eu lieu.

Toute future intégration devra expliquer les données utilisées, demander les autorisations nécessaires et distinguer clairement une simulation d’une exécution réelle.

## Licence

MIT. Voir le fichier [LICENSE](LICENSE).
