# Dossier des rendus Aurora

Tous les modèles 3D `.glb` générés par le pipeline Aurora (ou déposés manuellement) vivent ici.

## Deux sources

### 1. Auto-commit via l'API (`/api/aurora-status`)

Quand un job Aurora se termine avec succès :
1. Le serveur récupère le `.glb` depuis le tunnel Aurora
2. Il **commit le fichier ici** via l'API GitHub Contents (env var `GITHUB_TOKEN`)
3. Vercel détecte le commit → redéploiement automatique → le fichier devient servi à `/assets/aurora/<hash>.glb`
4. Dans l'attente du redeploy, l'URL `https://raw.githubusercontent.com/juancodepyandc/site_rep/main/assets/aurora/<hash>.glb` est valide immédiatement
5. L'URL stable est cachée en Redis (90 jours) — la prochaine génération du même prompt renvoie l'URL directement, sans relancer Aurora

Nom de fichier : `<hash8>.glb` (hash du prompt — déterministe, donc 2 prompts identiques écrasent le même fichier)

### 2. Drop manuel

Pose n'importe quel `.glb` (ou `.gltf`) à la racine de ce dossier ou dans `manual/`, commit, push :
```
cp ~/mon-rendu.glb assets/aurora/manual/tour-signature.glb
git add assets/aurora/manual/tour-signature.glb
git commit -m "aurora: ajout manuel tour signature"
git push
```
Vercel redéploie, le fichier est servi à `/assets/aurora/manual/tour-signature.glb`. Tu peux ensuite l'utiliser comme aperçu via le viewer.

## Structure

```
assets/aurora/
├── README.md             # ce fichier
├── .gitkeep              # garde le dossier tracké même vide
├── <hash>.glb            # rendus auto par Aurora
└── manual/
    ├── .gitkeep
    └── *.glb             # tes drops manuels
```

## Sync local ↔ GitHub

Le workflow est standard git :
- Aurora pousse → toi tu fais `git pull` → tu récupères les `.glb` localement
- Tu poses un fichier en local → `git add` + `git commit` + `git push` → GitHub a la copie officielle
- Pas de stockage tiers, pas de Vercel Blob, pas de S3 — uniquement git + Vercel + GitHub raw

## Limites

- **Taille** : Vercel/GitHub n'aiment pas les fichiers > 100 MB. Les rendus Aurora font typiquement 5-30 MB, ça passe largement.
- **Quota repos** : un repo public a une limite recommandée de 1 GB. Si tu génères 100 rendus à 30 MB, tu approches. Pour purger : supprimer les vieux `.glb` et `git push`.
- **Délai redeploy** : ~30-60 s entre le commit auto et la dispo de l'URL `/assets/aurora/...`. L'URL `raw.githubusercontent.com` marche immédiatement après le commit (et c'est celle qu'on renvoie au client).

## Configuration requise

Dans Vercel → Settings → Environment Variables :
- `AURORA_KEY` (obligatoire, `aur_...` fourni par le propriétaire d'Aurora)
- `AURORA_BASE_URL` (optionnel — sinon résolution auto via le fichier `tunnel_url.txt` du repo Aurora)
- `GITHUB_TOKEN` (obligatoire pour le commit auto, scope `repo` ou Fine-grained `Contents:write` sur ce repo)
- `GITHUB_OWNER` (optionnel, défaut `juancodepyandc`)
- `GITHUB_REPO` (optionnel, défaut `site_rep`)
- `GITHUB_BRANCH` (optionnel, défaut `main`)

Sans `GITHUB_TOKEN`, le rendu fonctionne mais reste sur l'URL éphémère du tunnel Aurora (perdu à chaque rotation du tunnel).
