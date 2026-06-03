# KOVELA — Activation cabinet · parcours canonique

> **Dernière mise à jour** : 2026-06-03 · **Référence décisions** : [`DECISIONS_LOG.md`](./DECISIONS_LOG.md).
>
> **Audience** : Adrien (fondateur), Émilien (lead dev V1), RevOps, DPO, avocat e-santé.
> **Statut** : spec produit + architecture cible. À lire **avant tout développement V1**.
> **Lecture obligatoire Émilien** : oui.

---

## 1. Pourquoi pas d'inscription libre

KOVELA est un **service opéré premium**, pas un logiciel self-service. Un chirurgien
n'est jamais activé sans :

1. avoir eu un échange (call visio) avec l'équipe KOVELA ;
2. avoir été qualifié dans le CRM (`/admin/crm`) ;
3. avoir explicitement accordé son accord verbal ;
4. avoir reçu un **lien d'activation personnalisé** transmis par l'équipe KOVELA.

Le mot « inscription », « créer un compte gratuitement », « essai gratuit » ou
« commencer seul » est **interdit** dans toute la surface produit (landing, app,
documentation publique).

**Wording validé** :
- Activer votre espace KOVELA
- Finaliser votre accès cabinet
- Démarrer la mise en place accompagnée
- Compléter votre activation cabinet

---

## 2. Parcours canonique CRM → cabinet actif

```
1. Prospect créé dans /admin/crm                       (status: a_contacter)
2. Call visio KOVELA · qualification                   (status: contacte → call_prevu → demo_faite)
3. Accord verbal après échange                         (status: accord_verbal)
4. Admin KOVELA génère le lien d'activation cabinet    (activation.generatedAt)
5. Admin copie le lien (transmis par email + canal de son choix)
                                                       (activation.linkCopiedAt)
6. Chirurgien clique le lien                           (activation.linkOpenedAt)
   → arrive sur /chirurgien/activation/[token]
7. Chirurgien clique « Activer mon espace cabinet »    (activation.onboardingStartedAt)
   → redirigé vers /chirurgien/onboarding?from=activation&prospect=<id>
8. Onboarding cabinet 6 étapes complété                (onboardingLaunched = true)
   → onboarding_complete log
9. Référentiel essentiel construit avec KOVELA         (activation.referentielReviewedAt)
   → cf. /chirurgien/referentiel
10. Cabinet actif                                       (activation.cabinetActivatedAt)
    → status: actif · isActive = true · mandateStatus: mandat_actif
```

---

## 3. Statuts activation (dérivés des timestamps)

Le sous-objet `prospect.activation: ProspectActivation` porte la chronologie. Les
statuts UI sont **dérivés** des timestamps présents, pas d'un enum séparé :

| Timestamp présent | Statut UI affiché |
|---|---|
| `generatedAt` seul | **Lien généré** |
| + `linkCopiedAt` | **Lien copié / transmis** |
| + `linkOpenedAt` | **Lien ouvert par le chirurgien** |
| + `onboardingStartedAt` | **Onboarding lancé** |
| + `cabinetActivatedAt` | **Cabinet actif** |

Une étape `referentielReviewedAt` peut être positionnée à part — typiquement après
la session de relecture du référentiel essentiel avec l'équipe KOVELA.

---

## 4. Ce qui est mocké · prototype

- **Token** : chaîne opaque sans signature (`act_<random>_<prospectIdSuffix>`).
- **Mapping token → prospect** : en mémoire (`lib/store.tsx · prospectByToken`).
- **Email d'envoi** : **non existant** — l'admin copie l'URL et la transmet par le
  canal de son choix.
- **TTL technique** : aucun. Une étiquette « informatif 7j » peut être affichée
  côté UI mais aucune logique de blocage prototype.
- **Révocation** : aucune.
- **Audit trail** : 4 LogKinds ajoutés (`activation_link_generated`,
  `activation_link_copied`, `activation_link_opened`,
  `activation_onboarding_lance`), persistés en mémoire seulement.
- **Authentification chirurgien** : aucune (le sélecteur de rôle `/login` reste
  l'entrée démo). En mode démo (`/chirurgien/onboarding` sans `from=activation`),
  un banner amber « Mode démo » s'affiche pour ne pas mentir narrativement.

---

## 5. Ce qui doit être réel en V1 pilote

**Lien d'activation**
- **JWT signé HS256** (secret env `ACTIVATION_TOKEN_SECRET`).
- **TTL 7 jours** (configurable via env), expiration vérifiée côté serveur.
- **Redemption unique** : invalidé à la 1ʳᵉ utilisation, stocké en BDD (`prospect_activation_tokens` table append-only).
- **Révocation manuelle** possible depuis CRM (bouton « Révoquer le lien »).

**Email transactionnel**
- Mailgun ou SendGrid (DPA validé · UE-only).
- Template versionné côté repo.
- Webhook delivery / open / click logué côté CRM.
- En cas de bounce : statut `email_bounce` côté prospect, alerte admin.

**Authentification chirurgien**
- Clerk ou Auth.js (à arbitrer avec Émilien et DPO).
- À la 1ʳᵉ activation, le chirurgien crée un mot de passe (+ MFA optionnel V1, obligatoire V2).
- Sessions sécurisées (httpOnly, SameSite=Lax, expiration 12h).

**Audit trail immuable**
- Append-only sur table `audit_logs` (PostgreSQL).
- Hash chaining sur les logs d'activation pour détection altération.
- Conservation à arbitrer avec DPO (cf. `REGULATORY_REVIEW_NOTES.md` § 13.9).

**Statut CRM piloté**
- KPI conversion `accord_verbal → onboarding_lance → actif`.
- Délai moyen entre chaque étape.
- Cohorte « prospects bloqués depuis > 14 jours sans activation » → alerte RevOps.
- Relance manuelle + automatique J+3 si lien non cliqué.

---

## 6. Ce qu'Émilien doit prévoir explicitement

### Modèle de données
```ts
ProspectActivationToken {
  id           : uuid
  prospect_id  : uuid (FK)
  token_hash   : varchar(64)   // sha256(token)
  generated_at : timestamptz
  generated_by : uuid (FK users)
  ttl_expires_at : timestamptz
  link_copied_at : timestamptz?
  link_opened_at : timestamptz?
  redeemed_at  : timestamptz?
  revoked_at   : timestamptz?
  revoked_by   : uuid (FK users)?
  ip_hash_first_open : varchar(64)?  // sha256(IP) pour détection anomalie
}
```

### Endpoints API V1
- `POST /api/admin/prospects/{id}/activation-token` — génère un nouveau token (révoque les précédents).
- `GET /api/activation/{token}` — valide le token (TTL, redemption), retourne `prospect` (limité).
- `POST /api/activation/{token}/start-onboarding` — marque `link_opened_at` + `redeemed_at`, ouvre une session chirurgien.
- `POST /api/admin/prospects/{id}/revoke-activation` — révoque tous les tokens actifs.

### Frontend
- `app/chirurgien/activation/[token]/page.tsx` (existe en prototype, à brancher API V1).
- Écran d'erreur dédié (lien expiré, lien révoqué, lien inconnu) — pas de fuite d'info.
- Banner mode démo conservé pour les environnements `dev` / `staging`.

### Sécurité
- Token **jamais loggé en clair** (ni stdout, ni BDD, ni audit).
- Logs CRM : afficher uniquement les 4 premiers caractères suivis de `…`.
- Anti-bruteforce : rate limit `GET /api/activation/{token}` (10 essais / IP / 10 min).
- Anti-leak : pas d'info chirurgien dans l'écran d'erreur si token invalide.

### Logs / KPIs RevOps
- `activation_link_generated` — qui, quand, pour quel prospect.
- `activation_link_opened` — quand, IP hashée, user-agent.
- `activation_link_revoked` — qui, quand, motif.
- KPI : taux de redemption, délai moyen génération → ouverture, taux d'expiration.

### À arbitrer avec DPO / Aumans avant V1 prod
- Durée de conservation des tokens utilisés (proposition de travail : 3 ans, **non validée**).
- Mention RGPD dans le mail d'activation (information préalable patient absente, mais info chirurgien : éditeur, DPO contact, droits).
- Identification cabinet (SIRET / RPPS) avant ou pendant l'activation ?
- Cas représentant légal (assistante autorisée à activer en l'absence du chirurgien) ?

---

## 7. Limites prototype assumées

| Sujet | Prototype | V1 pilote | V1 prod |
|---|---|---|---|
| Token signature | ❌ aucune | ✅ JWT HS256 | ✅ JWT HS256 + rotation clé |
| TTL technique | ❌ aucun | ✅ 7j vérifié | ✅ 7j vérifié + révocation BDD |
| Redemption unique | ❌ non | ✅ oui | ✅ oui |
| Email transactionnel | ❌ copie manuelle URL | ✅ Mailgun/SendGrid DPA | ✅ idem + monitoring |
| Auth chirurgien | ❌ sélecteur démo | ✅ Clerk/Auth.js + MFA opt. | ✅ idem + MFA obligatoire |
| Audit trail | ⚠️ logs en mémoire | ✅ BDD append-only | ✅ BDD + hash chaining |
| Anti-bruteforce | ❌ aucun | ✅ rate limit IP | ✅ idem + WAF |
| Révocation | ❌ aucune | ✅ admin CRM | ✅ idem + auto si fraude détectée |
| Information préalable RGPD | ⚠️ doctrine prototype | ✅ texte validé Aumans | ✅ idem + horodatage |

---

## 8. Wording de l'écran activation (verrouillé)

Conserver les phrases canoniques de l'écran `/chirurgien/activation/[token]` :

- **Eyebrow** : « Lien d'activation cabinet »
- **H1** : « Bienvenue Dr {Prénom} {Nom}. »
- **Tagline** : « Activer votre espace KOVELA. »
- **CTA primary** : « Activer mon espace cabinet »
- **CTA secondary** : « Une question avant d'activer »
- **Doctrine bas** : « Le chirurgien garde la main. KOVELA organise le flux. »
- **Disclaimer prototype** : « Prototype de démonstration. Aucune signature électronique,
  aucun prélèvement réel, aucune donnée patient sur ce site. En V1, le lien d'activation
  est signé, expirable et révocable, et le mandat GoCardless est réel avant que les
  premiers patients ne soient suivis. »

**Wording interdit** : s'inscrire · créer un compte gratuitement · essai gratuit ·
commencer seul · self-service.

---

## 9. Démo · comment tester en prototype

1. Aller sur `/admin/crm`.
2. Ouvrir la fiche d'un prospect en `accord_verbal` (par défaut : **Dr Élise Roy · Institut Roy · Paris**, `pr11`, déjà seedé avec un token démo).
3. Cliquer « Voir le lien d'activation » (le token est seedé : `act_demo_seed_r11`).
4. Copier l'URL ou ouvrir directement via le bouton « Ouvrir ↗ ».
5. L'écran d'activation se charge avec le nom et le cabinet du prospect.
6. Cliquer « Activer mon espace cabinet » → redirigé vers `/chirurgien/onboarding?from=activation&prospect=pr11`.
7. Le titre de l'onboarding devient « Bienvenue Dr Élise Roy » + banner amber « Mode démo » disparaît.
8. Vérifier dans `/logs` les 4 nouveaux LogKinds activation.

Pour tester un lien invalide : ouvrir `/chirurgien/activation/INVALIDE` → écran
d'erreur premium « Lien expiré ou invalide ».

---

## 10. Références internes

- [`DECISIONS_LOG.md`](./DECISIONS_LOG.md) § 11 — Admin / cockpit + Volumes prototype / proof case / scale.
- [`PRODUCT_SCOPE.md`](./PRODUCT_SCOPE.md) § 1 (CRM) et § 14 (Facturation cabinet).
- [`TECHNICAL_NOTES.md`](./TECHNICAL_NOTES.md) § 0 — couverture produit fine.
- [`V1_HDS_ARCHITECTURE_BRIEF.md`](./V1_HDS_ARCHITECTURE_BRIEF.md) — RBAC, auth, audit trail.
- [`REGULATORY_REVIEW_NOTES.md`](./REGULATORY_REVIEW_NOTES.md) § 13.9 — conservation données.
- [`AI_REQUIREMENTS.md`](./AI_REQUIREMENTS.md) — non concerné (l'activation cabinet n'utilise pas l'IA).
