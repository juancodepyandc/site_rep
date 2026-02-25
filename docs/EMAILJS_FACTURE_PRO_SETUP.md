# Setup EmailJS Facture Mail (pro, sans PDF)

## 1) Variables d'environnement (Vercel)
Ajoute ces variables dans le projet Vercel:

- `EMAILJS_RECEIPT_SERVICE_ID`
- `EMAILJS_RECEIPT_TEMPLATE_ID`
- `EMAILJS_RECEIPT_PUBLIC_KEY`
- `EMAILJS_RECEIPT_PRIVATE_KEY` (optionnel, recommande pour endpoint serveur)
- `ATELIER_RECEIPT_COPY_EMAIL` (email atelier qui recoit aussi une copie)
- `ATELIER_COMPANY_NAME` (ex: `Atelier Electronique`)
- `ATELIER_COMPANY_EMAIL` (ex: `rabuteaujuandavid@gmail.com`)
- `ATELIER_COMPANY_PHONE` (optionnel)
- `ATELIER_COMPANY_ADDRESS` (optionnel)

Puis redeploie.

Note:
- Ces variables `RECEIPT_*` sont uniquement pour la facture post-achat.
- Tes formulaires devis/support restent sur leur configuration actuelle et ne sont pas impactés.

## 2) Template EmailJS dedie facture
Dans EmailJS:

1. Cree un template (ex: `template_facture_pro`).
2. Mets `To Email` sur `{{to_email}}`.
3. Mets le `Subject`:

```text
{{subject}}
```

4. Mets le corps HTML:

```html
{{{message_html}}}
<hr />
<p style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;">
Ref commande: {{order_id}} | Ref devis: {{quote_code}} | Facture: {{invoice_number}}
</p>
```

## 3) Variables disponibles dans le template

- `to_email`
- `from_name`
- `reply_to`
- `subject`
- `buyer_name`
- `buyer_email`
- `quote_code`
- `order_id`
- `capture_id`
- `invoice_number`
- `invoice_date`
- `amount_paid`
- `amount_subtotal`
- `amount_vat`
- `usage`
- `config_lines`
- `message_text`
- `message_html`

## 4) Flux attendu
Au retour PayPal:

1. Capture de paiement.
2. Recuperation du devis par `quoteCode`.
3. Construction de la facture directement dans le mail (HTML + texte).
4. Envoi EmailJS client.
5. Envoi d'une copie atelier (`ATELIER_RECEIPT_COPY_EMAIL`).

## 5) Test rapide
1. Lance `vercel dev`.
2. Active le mode admin dans le configurateur puis charge un devis.
3. Clique `Facture test (mail)`:
   - un apercu s'ouvre sans passer par PayPal
   - puis tu peux choisir d'envoyer un email test
4. Controle la reception client + copie atelier.
5. Teste ensuite le flux PayPal reel/sandbox.
