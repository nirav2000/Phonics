# Word Vault v3 (Firebase)

This build swaps the shared database from Supabase to Firebase Firestore and moves the speech logic into a reusable file.

## What's new
- Firebase Firestore shared storage
- Separate reusable speech helper: `word-vault-voice.js`
- Voice selection inside the app
- Rate and pitch controls
- Better support for iPad-style speech behaviour
- Alexa Lambda starter that writes to Firestore

## Files
- `index.html` - main app
- `word-vault-voice.js` - reusable voice module
- `firebase-firestore.rules` - starter Firestore rules
- `firebase-indexes.json` - starter Firestore composite index
- `alexa-skill-lambda-firebase.js` - Alexa Lambda starter
- `interaction-model-v3.json` - Alexa skill interaction model
- `CODEX-HANDOFF.md` - concise project handoff for future coding work

## Firestore setup
1. Create a Firebase project.
2. Enable Firestore Database.
3. Deploy `firebase-firestore.rules` and `firebase-indexes.json`.
4. In Firebase console, create a web app and copy its config JSON.
5. Paste that config JSON into the app's Firebase setup box.
6. Choose a `family_id` and use the same value everywhere.

## Alexa setup
The Alexa Lambda starter expects these environment variables:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `WORD_VAULT_DEFAULT_FAMILY_ID`

The Lambda uses `firebase-admin` and writes directly to the `words` collection.

## Voice notes for Chrome on iPad
Speech on iPad can be more temperamental than on desktop browsers.
Best practice:
- host the page on GitHub Pages or Firebase Hosting
- tap a speech button directly
- use the `Wake up voice` button once after load if needed
- refresh voices if the dropdown is empty at first

## Reusing the speech helper in another app
1. Copy `word-vault-voice.js` into the new app.
2. Include it with a regular script tag.
3. Create a new `WordVaultVoice` instance.
4. Render the voices into your own dropdown.
5. Call `.speak(text, options)` from a user-initiated tap.
