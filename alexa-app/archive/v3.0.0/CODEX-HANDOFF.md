Project: Word Vault v3 Firebase

Goal:
Build a reading-support system for a 9-year-old that captures tricky words from books, stores child-friendly definitions/examples, syncs across devices, and supports Alexa voice entry.

Current stack:
- Vanilla HTML/CSS/JS frontend
- Firebase Firestore for shared storage
- Reusable speech module in a separate file: word-vault-voice.js
- AWS Lambda Alexa custom skill backend writing to Firestore via firebase-admin
- Static hosting for frontend (GitHub Pages/Firebase Hosting/Netlify)

Main files:
- index.html = main web app
- word-vault-voice.js = reusable speech helper, designed to be copied into other apps with minimal change
- firebase-firestore.rules = starter Firestore rules
- firebase-indexes.json = composite index for family_id + updated_at
- alexa-skill-lambda-firebase.js = Alexa Lambda starter using Firestore
- interaction-model-v3.json = Alexa interaction model

Key product changes from prior version:
- Moved shared database from Supabase to Firebase Firestore
- Added voice choice in app via a select dropdown
- Added rate + pitch controls in app
- Split speech logic out into a reusable file
- Added explicit iPad-friendly warm-up path for speech

Important platform note:
- User is currently using Chrome on iPad.
- Treat browser speech behavior as iPad/iOS-like rather than desktop Chrome-like.
- Prefer hosted pages over file previews for speech testing.
- Speech actions should be triggered directly from a user tap.

Data model for words:
- id
- family_id
- word
- source
- status (new/review/secure)
- child_age
- category
- phonics
- definition
- sentence
- similar
- not_this
- notes
- created_at
- updated_at
- created_by (optional, e.g. alexa)

Next priorities:
1. Tighten Firestore security rules and add Firebase Auth
2. Add dedupe logic: one canonical record per family_id + lowercased word + source
3. Add enrichment pipeline so Alexa-added words auto-fill definition/sentence later
4. Add review mode in web app:
   - flashcards
   - confusion pairs
   - read-don't-guess exercises
5. Add analytics:
   - common misreads
   - weak phonics patterns
   - long multi-syllable words needing chunking
6. Add better Alexa slot dialog so missing word/source/family prompts are handled naturally
7. Consider storing preferred voice per family or child profile instead of per browser only

Constraints:
- Keep frontend static and framework-free unless necessary
- Keep voice module generic so other apps can reuse it
- Keep Firebase config entry simple for a parent to paste in
- Keep Alexa + web using the same family_id
