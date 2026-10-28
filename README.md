# FlowMind

**Décris. Construis. Automatise.**  
Open-source workflow automation for everyone.

FlowMind est une interface de workflows responsive, disponible sur le web et sous forme d’application Android. Le projet est un MVP : les workflows créés restent en mémoire dans la session du navigateur et le bouton « Tester » lance uniquement une simulation. Aucune intégration externe ni action réelle n’est exécutée.

## Essayer FlowMind

- **Version web :** https://dartist-fr.github.io/FlowMind/
- **Télécharger l’APK Android :** https://github.com/dartist-fr/FlowMind/releases
- **Code source :** https://github.com/dartist-fr/FlowMind

La première publication web peut prendre quelques minutes après l’activation de GitHub Pages dans les paramètres du dépôt (source « GitHub Actions »).

## Développement local

Prérequis : Node.js 22 ou plus récent.

~~~bash
git clone https://github.com/dartist-fr/FlowMind.git
cd FlowMind
npm install
npm run dev
~~~

Pour vérifier le build de production :

~~~bash
npm run build
npm run preview
~~~

## Déploiement

Le workflow `.github/workflows/pages.yml` construit l’application et la publie sur GitHub Pages à chaque push sur `main`.

## Application Android

Le workflow `.github/workflows/android-release.yml` construit l’application web, l’intègre dans une coquille Android via Capacitor et publie l’APK de test sur une GitHub Release à chaque tag `v*`. Pour lancer une publication, crée un tag, par exemple `v0.1.0`.

L’APK initial généré par ce workflow est un **APK debug** destiné aux essais et à l’installation manuelle. Ce n’est pas une version signée pour publication sur Google Play.

## État du MVP

- Tableau de bord responsive.
- Création de workflows dans la session en cours.
- Recherche et simulation explicitement signalée.
- Déploiement web et empaquetage Android automatisés.

La sauvegarde persistante, l’éditeur visuel de nœuds, le moteur d’exécution réel, les intégrations et l’assistant IA ne sont pas encore implémentés.

## Sécurité

- Une simulation ne doit jamais prétendre qu’une action externe a réellement eu lieu.
- Ne pas enregistrer de secrets dans les workflows ou les journaux.
- Toute future action externe devra être validée et explicitement autorisée.

## Licence

MIT. Voir le fichier [LICENSE](LICENSE).
