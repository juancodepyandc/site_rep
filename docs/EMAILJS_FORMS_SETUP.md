# Setup Formulaires (Vercel)

Les formulaires du site (`PC`, `Mobile`, `Contact`, `Devis`) passent par `/api/send-email`:

- plus aucune cle EmailJS en clair dans `script.js`
- configuration uniquement via variables Vercel

## Option recommandee (gratuite): Resend

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (ex: `onboarding@resend.dev` pour test)
- `RESEND_FROM_NAME` (ex: `Atelier Electronique`)
- `EMAILJS_FORM_TO_EMAIL` (email qui recoit toutes les demandes)

## Alternative sans domaine payant: Gmail SMTP

Si Resend bloque (domaine non verifie), ajoute:

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`

Le backend essaie automatiquement Resend puis Gmail SMTP.

## Fallback EmailJS (optionnel)

- `EMAILJS_FORM_SERVICE_ID`
- `EMAILJS_FORM_TEMPLATE_ID`
- `EMAILJS_FORM_PUBLIC_KEY`
- `EMAILJS_FORM_PRIVATE_KEY` (optionnel)

## Template EmailJS pour formulaires (si fallback utilise)

Dans EmailJS (template formulaires), garde ces champs:

- Subject: `{{subject}}`
- To Email: `{{to_email}}`
- Body:

```text
Nom: {{from_name}}
Email reponse: {{reply_to}}
------------------------
{{message}}
```

## Separation avec la facture

- Formulaires: `EMAILJS_FORM_*`
- Facture post-achat: `EMAILJS_RECEIPT_*`

Les deux flux sont independants.
