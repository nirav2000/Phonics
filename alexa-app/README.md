# Word Vault

A simple word-bank web app for reading support.

## What it does

- Add new words from books
- Save child-friendly meanings, example sentences, similar words, and notes
- Auto-fill using free dictionary services when available
- Store everything in browser local storage
- Export and import JSON
- Includes a starter Alexa skill webhook and interaction model

## Files

- `index.html` — main web app
- `alexa-skill-starter.js` — starter webhook code for an Alexa custom skill
- `interaction-model.json` — Alexa interaction model starter

## Run locally

Open `index.html` in a browser.

For best results, host it on GitHub Pages or any static host.

## Recommended next step

Move storage from browser local storage to a simple backend so Alexa and the web app can share the same words.

Good options:
- Firebase
- Supabase
- Airtable plus a tiny serverless function

## Suggested API shape

- `POST /words` → add a word
- `GET /words` → list all words
- `POST /lookup` → enrich a word with definition and sentence
- `PATCH /words/:id` → update status or notes

## Suggested voice phrases

- “Alexa, open Word Vault”
- “Alexa, tell Word Vault to add the word blizzard from Yeti in the Playground”
- “Alexa, ask Word Vault what blizzard means”
