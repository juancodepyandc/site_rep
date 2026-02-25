# Setup EmailJS Formulaires (Vercel)

Les formulaires du site (`PC`, `Mobile`, `Contact`, `Devis`) passent maintenant par `/api/send-email`:

- plus aucune cle EmailJS en clair dans `script.js`
- configuration uniquement via variables Vercel

## Variables Vercel a ajouter

- `EMAILJS_FORM_SERVICE_ID`
- `EMAILJS_FORM_TEMPLATE_ID`
- `EMAILJS_FORM_PUBLIC_KEY`
- `EMAILJS_FORM_PRIVATE_KEY` (optionnel)
- `EMAILJS_FORM_TO_EMAIL` (email qui recoit toutes les demandes)

## Template EmailJS pour formulaires

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
